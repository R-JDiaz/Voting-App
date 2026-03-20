const { Server } = require('socket.io');
const { masterPool } = require('./config/database');

const db = masterPool;

let io;
const electionTimers = {}; // Store active timers

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins an election room
    socket.on('joinElection', async (electionId) => {
      socket.join(`election_${electionId}`);
      console.log(`User ${socket.id} joined election_${electionId}`);

      // Send initial countdown & status
      const [rows] = await db.query(
        'SELECT countdown, status FROM elections WHERE id = ?',
        [electionId]
      );

      if (rows.length) {
        const election = rows[0];

        // Send countdown and status
        socket.emit('countdownUpdate', {
          electionId,
          remaining: election.countdown,
          status: election.status
        });

        // Send current total votes
        const [votesExist] = await db.query(
          'SELECT COUNT(*) as totalVotes FROM votes WHERE election_id = ?',
          [electionId]
        );
        socket.emit('voteUpdate', { totalVotes: votesExist[0].totalVotes });

        // Start countdown if active
        if (election.status === 'active') {
          broadcastCountdown({ id: electionId });
        }
      }
    });

    socket.on('leaveElection', (electionId) => {
      socket.leave(`election_${electionId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

/**
 * Start countdown timer for an election
 */
async function broadcastCountdown(election) {
  if (!io) return;

  const electionId = election.id;

  // Prevent duplicate timers
  if (electionTimers[electionId]) return;

  electionTimers[electionId] = setInterval(async () => {
    try {
      const [rows] = await db.query(
        'SELECT countdown, status FROM elections WHERE id = ?',
        [electionId]
      );

      if (!rows.length) return;

      let { countdown, status } = rows[0];
      let remaining = parseInt(countdown) || 0;

      // Stop timer if paused
      if (status === 'pending') {
        clearInterval(electionTimers[electionId]);
        delete electionTimers[electionId];
        return;
      }

      // Countdown finished
      if (remaining <= 0) {
        await masterPool.query(
          'UPDATE elections SET countdown = 0, status = "ended" WHERE id = ?',
          [electionId]
        );

        io.to(`election_${electionId}`).emit('countdownUpdate', {
          electionId,
          remaining: 0,
          status: 'ended'
        });

        // Send final vote total
        const [votesExist] = await db.query(
          'SELECT COUNT(*) as totalVotes FROM votes WHERE election_id = ?',
          [electionId]
        );
        const totalVotes = votesExist[0].totalVotes;
        io.to(`election_${electionId}`).emit('voteUpdate', { totalVotes });

        // Fetch final results grouped by position
        const [voteResults] = await db.query(`
          SELECT 
            p.id AS position_id,
            p.name AS position_name,
            c.id AS candidate_id,
            c.name AS candidate_name,
            COUNT(v.id) AS vote_count
          FROM positions p
          LEFT JOIN candidates c ON c.position_id = p.id
          LEFT JOIN votes v ON c.id = v.candidate_id
          WHERE p.election_id = ?
          GROUP BY p.id, c.id
          ORDER BY p.id, vote_count DESC
        `, [electionId]);

        const [positions] = await db.query(
          'SELECT id, name FROM positions WHERE election_id = ? ORDER BY id',
          [electionId]
        );

        const results = positions.map(pos => ({
          position_name: pos.name,
          candidates: voteResults
            .filter(r => r.position_id === pos.id)
            .map(r => ({
              candidate_id: r.candidate_id,
              candidate_name: r.candidate_name,
              votes_count: r.vote_count || 0
            }))
        }));

        io.to(`election_${electionId}`).emit('electionEnded', {
          electionId,
          hasVotes: totalVotes > 0,
          results
        });

        clearInterval(electionTimers[electionId]);
        delete electionTimers[electionId];
        return;
      }

      // Decrement countdown
      remaining--;
      await masterPool.query(
        'UPDATE elections SET countdown = ? WHERE id = ?',
        [remaining, electionId]
      );

      io.to(`election_${electionId}`).emit('countdownUpdate', {
        electionId,
        remaining,
        status: 'active'
      });

      // Emit current vote total
      const [votesExist] = await db.query(
        'SELECT COUNT(*) as totalVotes FROM votes WHERE election_id = ?',
        [electionId]
      );
      const totalVotes = votesExist[0].totalVotes;
      io.to(`election_${electionId}`).emit('voteUpdate', { totalVotes });

    } catch (err) {
      console.error('Countdown error:', err);
    }
  }, 1000);
}

/**
 * Broadcast general election update
 */
function broadcastElectionUpdate(election) {
  if (!io) return;

  const remaining = parseInt(election.countdown, 10) || 0;

  io.to(`election_${election.id}`).emit('electionUpdate', {
    ...election,
    remaining,
    status: election.status
  });

  if (election.status === 'active') {
    broadcastCountdown(election);
  }
}

/**
 * Function to emit vote update manually (after user votes)
 */
async function emitVoteUpdate(electionId) {
  const [votesExist] = await db.query(
    'SELECT COUNT(*) as totalVotes FROM votes WHERE election_id = ?',
    [electionId]
  );
  const totalVotes = votesExist[0].totalVotes;
  io.to(`election_${electionId}`).emit('voteUpdate', { totalVotes });
}

module.exports = {
  initSocket,
  broadcastCountdown,
  broadcastElectionUpdate,
  emitVoteUpdate
};