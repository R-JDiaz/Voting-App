const { masterPool, getAvailableSlave } = require('../config/database');
const { broadcastElectionUpdate } = require('../socket');

const db = getAvailableSlave();
const ALLOWED_FIELDS = ['title', 'description', 'countdown', 'status'];

// ------------------------
// Create election (Admin only)
// ------------------------
exports.createElection = async (req, res, next) => {
  try {
    const { title, description, countdown, status } = req.body;
    const created_by = req.user.id;

    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

    const countdownSec = parseInt(countdown, 10) || 3600;

    const [result] = await masterPool.query(
      `INSERT INTO elections (title, description, countdown, status, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [title, description || null, countdownSec, status || 'pending', created_by]
    );

    const newElection = {
      id: result.insertId,
      title,
      description: description || null,
      countdown: countdownSec,
      remaining: countdownSec,
      status: status || 'pending',
      created_by
    };

    broadcastElectionUpdate(newElection);

    res.status(201).json({
      success: true,
      message: 'Election created successfully',
      data: newElection
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------
// Update election
// ------------------------
exports.updateElection = async (req, res, next) => {
  try {
    const { election_id } = req.params;
    const body = req.body;

    const [rows] = await db.query('SELECT * FROM elections WHERE id = ?', [election_id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Election not found' });

    const currentElection = rows[0];

    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(body)) {
      if (!ALLOWED_FIELDS.includes(key)) continue;
      updates.push(`${key} = ?`);
      values.push(value !== undefined && value !== null ? value : currentElection[key]);
    }

    if (updates.length === 0) return res.status(400).json({ success: false, message: 'No valid fields to update' });

    values.push(election_id);
    await masterPool.query(`UPDATE elections SET ${updates.join(', ')} WHERE id = ?`, values);

    const [updatedRows] = await db.query('SELECT * FROM elections WHERE id = ?', [election_id]);
    const updatedElection = updatedRows[0];

    updatedElection.remaining = parseInt(updatedElection.countdown, 10) || 0;
    updatedElection.isActive = updatedElection.remaining > 0;

    const [positions] = await db.query('SELECT * FROM positions WHERE election_id = ?', [election_id]);
    for (const pos of positions) {
      const [candidates] = await db.query('SELECT * FROM candidates WHERE position_id = ?', [pos.id]);
      pos.candidates = candidates;
    }
    updatedElection.positions = positions;

    broadcastElectionUpdate(updatedElection);

    res.json({ success: true, message: 'Election updated successfully', data: updatedElection });
  } catch (err) {
    next(err);
  }
};

// ------------------------
// Get all elections (Admin sees all, users see joined)
// ------------------------
exports.getAllElections = async (req, res, next) => {
  try {
    let elections;

    if (req.user.role === 'admin') {
      // Admin sees all elections
      [elections] = await db.query(`
        SELECT 
          e.*, 
          u.username AS created_by_username,

          (SELECT COUNT(*) FROM positions p WHERE p.election_id = e.id) AS position_count,

          (SELECT COUNT(*) 
          FROM candidates c 
          JOIN positions p ON c.position_id = p.id 
          WHERE p.election_id = e.id
          ) AS candidate_count

        FROM elections e
        LEFT JOIN users u ON e.created_by = u.id
        ORDER BY e.created_at DESC
      `);
    } else {
      // Regular user: see elections they created OR joined
      [elections] = await db.query(`
      SELECT DISTINCT 
        e.*, 
        u.username AS created_by_username,

        (SELECT COUNT(*) FROM positions p WHERE p.election_id = e.id) AS position_count,

        (SELECT COUNT(*) 
        FROM candidates c 
        JOIN positions p ON c.position_id = p.id 
        WHERE p.election_id = e.id
        ) AS candidate_count

      FROM elections e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN user_elections ue ON e.id = ue.election_id
      WHERE e.created_by = ? OR ue.user_id = ?
      ORDER BY e.created_at DESC
    `, [req.user.id, req.user.id]);
    }

    const data = elections.map(e => ({
      ...e,
      remaining: parseInt(e.countdown, 10) || 0,
      isActive: parseInt(e.countdown, 10) > 0,
      position_count: e.position_count || 0,
      candidate_count: e.candidate_count || 0
    }));

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ------------------------
// Join election (User)
// ------------------------
exports.joinElection = async (req, res, next) => {
  try {
    const { election_id } = req.params;
    const user_id = req.user.id;

    // Check if election exists
    const [elections] = await db.query('SELECT * FROM elections WHERE id = ?', [election_id]);
    if (elections.length === 0) return res.status(404).json({ success: false, message: 'Election not found' });

    // Check if already joined
    const [joined] = await db.query('SELECT * FROM user_elections WHERE user_id = ? AND election_id = ?', [user_id, election_id]);
    if (joined.length > 0) return res.status(400).json({ success: false, message: 'Already joined this election' });

    await masterPool.query('INSERT INTO user_elections (user_id, election_id) VALUES (?, ?)', [user_id, election_id]);

    res.json({ success: true, message: 'Successfully joined election' });
  } catch (error) {
    next(error);
  }
};

// ------------------------
// Get single election (with positions/candidates)
// Admin or user joined
// ------------------------
exports.getElectionById = async (req, res, next) => {
  try {
    const { election_id } = req.params;
    const user_id = req.user.id;

    // Admin can see all elections
    if (req.user.role !== 'admin') {
      // Check if user joined OR is the creator
      const [allowed] = await db.query(`
        SELECT * FROM elections e
        LEFT JOIN user_elections ue ON e.id = ue.election_id
        WHERE e.id = ? AND (e.created_by = ? OR ue.user_id = ?)
      `, [election_id, user_id, user_id]);

      if (allowed.length === 0) {
        return res.status(403).json({ success: false, message: 'You are not allowed to access this election' });
      }
    }

    // Fetch the election with creator info
   const [elections] = await db.query(`
      SELECT 
        e.*, 
        u.username AS created_by_username,

        (SELECT COUNT(*) FROM positions p WHERE p.election_id = e.id) AS position_count,

        (SELECT COUNT(*) 
        FROM candidates c 
        JOIN positions p ON c.position_id = p.id 
        WHERE p.election_id = e.id
        ) AS candidate_count

      FROM elections e
      LEFT JOIN users u ON e.created_by = u.id
      WHERE e.id = ?
    `, [election_id]);

    if (elections.length === 0) {
      return res.status(404).json({ success: false, message: 'Election not found' });
    }

    const election = elections[0];

    election.remaining = parseInt(election.countdown, 10) || 0;
    election.isActive = election.remaining > 0;

    election.position_count = election.position_count || 0;
    election.candidate_count = election.candidate_count || 0;

    // Fetch positions and their candidates
    const [positions] = await db.query('SELECT * FROM positions WHERE election_id = ?', [election_id]);
    for (const pos of positions) {
      const [candidates] = await db.query('SELECT * FROM candidates WHERE position_id = ?', [pos.id]);
      pos.candidates = candidates;
    }
    election.positions = positions;

    res.json({ success: true, data: election });
  } catch (error) {
    next(error);
  }
};
// ------------------------
// Delete election
// ------------------------
exports.deleteElection = async (req, res, next) => {
  try {
    const { election_id } = req.params;
    const [rows] = await db.query('SELECT * FROM elections WHERE id = ?', [election_id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Election not found' });

    // Delete related data first
    await masterPool.query('DELETE FROM votes WHERE election_id = ?', [election_id]);
    await masterPool.query('DELETE FROM candidates WHERE position_id IN (SELECT id FROM positions WHERE election_id = ?)', [election_id]);
    await masterPool.query('DELETE FROM positions WHERE election_id = ?', [election_id]);
    await masterPool.query('DELETE FROM user_elections WHERE election_id = ?', [election_id]);
    await masterPool.query('DELETE FROM elections WHERE id = ?', [election_id]);

    broadcastElectionUpdate({ id: parseInt(election_id), deleted: true });

    res.json({ success: true, message: 'Election deleted successfully' });
  } catch (error) {
    next(error);
  }
};