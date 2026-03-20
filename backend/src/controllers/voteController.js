const { masterPool, getAvailableSlave} = require('../config/database');
const db = getAvailableSlave();
// Submit a vote
exports.submitVote = async (req, res, next) => {
  const connection = await masterPool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { candidate_id } = req.body;
    const user_id = req.user.id;

    // Get candidate and position info
    const [candidates] = await db.query(`
      SELECT c.*, p.election_id, p.id as position_id, e.status
      FROM candidates c
      JOIN positions p ON c.position_id = p.id
      JOIN elections e ON p.election_id = e.id
      WHERE c.id = ?
    `, [candidate_id]);

    if (candidates.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    const candidate = candidates[0];

    // Check if election is active
    if (!candidate.status == "active") {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Election is not active'
      });
    }

    // Check if user already voted for this position
    const [existingVotes] = await db.query(
      'SELECT id FROM votes WHERE user_id = ? AND position_id = ?',
      [user_id, candidate.position_id]
    );

    if (existingVotes.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'You have already voted for this position'
      });
    }

    // Submit vote
    const [result] = await connection.query(
      'INSERT INTO votes (user_id, candidate_id, election_id, position_id) VALUES (?, ?, ?, ?)',
      [user_id, candidate_id, candidate.election_id, candidate.position_id]
    );

    
    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Vote submitted successfully',
      data: {
        vote_id: result.insertId,
        candidate_id,
        position_id: candidate.position_id,
        election_id: candidate.election_id
      }
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// Get vote results for an election
exports.getElectionResults = async (req, res, next) => {
  try {
    const { election_id } = req.params;

    // Check if election exists
    const [elections] = await db.query('SELECT * FROM elections WHERE id = ?', [election_id]);
    if (elections.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    // Get results grouped by position
    const [results] = await db.query(`
      SELECT 
        p.id as position_id,
        p.name as position_name,
        c.id as candidate_id,
        c.name as candidate_name,
        COUNT(v.id) as vote_count,
        (COUNT(v.id) * 100.0 / NULLIF(
          (SELECT COUNT(*) FROM votes WHERE position_id = p.id), 0
        )) as vote_percentage
      FROM positions p
      LEFT JOIN candidates c ON p.id = c.position_id
      LEFT JOIN votes v ON c.id = v.candidate_id
      WHERE p.election_id = ?
      GROUP BY p.id, c.id
      ORDER BY p.id, vote_count DESC
    `, [election_id]);

    // Get total votes per position
    const [positionStats] = await db.query(`
      SELECT 
        p.id as position_id,
        p.name as position_name,
        COUNT(DISTINCT v.id) as total_votes,
        COUNT(DISTINCT c.id) as total_candidates
      FROM positions p
      LEFT JOIN candidates c ON p.id = c.position_id
      LEFT JOIN votes v ON p.id = v.position_id
      WHERE p.election_id = ?
      GROUP BY p.id
    `, [election_id]);

    // Format results by position
    const formattedResults = positionStats.map(pos => ({
      position_id: pos.position_id,
      position_name: pos.position_name,
      total_votes: pos.total_votes,
      total_candidates: pos.total_candidates,
      candidates: results
        .filter(r => r.position_id === pos.position_id)
        .map(r => ({
          candidate_id: r.candidate_id,
          candidate_name: r.candidate_name,
          vote_count: r.vote_count || 0,
          vote_percentage: parseFloat((r.vote_percentage || 0).toFixed(2))
        }))
    }));

    res.json({
      success: true,
      data: {
        election: elections[0],
        results: formattedResults
      }
    });
  } catch (error) {
    next(error);
  }
};
