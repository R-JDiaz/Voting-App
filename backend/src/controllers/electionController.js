const { masterPool, getAvailableSlave } = require('../config/database');
const { broadcastElectionUpdate } = require('../socket');

const db = getAvailableSlave();
// Allowed fields for updates
const ALLOWED_FIELDS = ['title', 'description', 'countdown', 'status'];

// ------------------------
// Create election (Admin only)
// ------------------------
exports.createElection = async (req, res, next) => {
  try {
    const { title, description, countdown, status} = req.body;
    const created_by = req.user.id;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const countdownSec = parseInt(countdown, 10) || 3600; // default 1 hour // elections start pending by default

    const [result] = await masterPool.query(
      `INSERT INTO elections (title, description, countdown, status, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [title, description || null, countdownSec, status, created_by]
    );

    const newElection = {
      id: result.insertId,
      title,
      description: description || null,
      countdown: countdownSec,
      remaining: countdownSec,
      status
    };

    // Broadcast new election to clients (optional, if relevant)
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
// Update election (Admin only)
// ------------------------
exports.updateElection = async (req, res, next) => {
  try {
    const { election_id } = req.params;
    const body = req.body;
    console.log(body)
    // Fetch current election
    const [rows] = await db.query('SELECT * FROM elections WHERE id = ?', [election_id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Election not found' });
    }
    const currentElection = rows[0];

    // Build dynamic updates
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(body)) {
      if (!ALLOWED_FIELDS.includes(key)) continue;
      updates.push(`${key} = ?`);
      values.push(value !== undefined && value !== null ? value : currentElection[key]);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }

    values.push(election_id);
    await masterPool.query(`UPDATE elections SET ${updates.join(', ')} WHERE id = ?`, values);

    // Fetch updated election row
    const [updatedRows] = await db.query('SELECT * FROM elections WHERE id = ?', [election_id]);
    const updatedElection = updatedRows[0];

    // Use stored isActive and countdown
    updatedElection.remaining = parseInt(updatedElection.countdown, 10) || 0;
    updatedElection.isActive = !!updatedElection.isActive; // respect admin control

    // Fetch positions and candidates
    const [positions] = await db.query('SELECT * FROM positions WHERE election_id = ?', [election_id]);
    for (const pos of positions) {
      const [candidates] = await db.query('SELECT * FROM candidates WHERE position_id = ?', [pos.id]);
      pos.candidates = candidates;
    }
    updatedElection.positions = positions;

    // Broadcast full election update
    broadcastElectionUpdate(updatedElection);

    res.json({
      success: true,
      message: 'Election updated successfully',
      data: updatedElection
    });

  } catch (err) {
    next(err);
  }
};
// ------------------------
// Get all elections
// ------------------------
exports.getAllElections = async (req, res, next) => {
  try {
    const [elections] = await db.query(`
      SELECT 
        e.*,
        u.username as created_by_username,
        COUNT(DISTINCT p.id) as position_count
      FROM elections e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN positions p ON e.id = p.election_id
      GROUP BY e.id
      ORDER BY e.created_at DESC
    `);

    const data = elections.map(e => ({
    ...e,
    remaining: e.countdown || 0,
    isActive: Boolean(e.isActive)
    }));

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ------------------------
// Get election by ID
// ------------------------
exports.getElectionById = async (req, res, next) => {
  try {
    const { election_id } = req.params;

    const [elections] = await db.query(`
      SELECT 
        e.*,
        u.username as created_by_username,
        COUNT(DISTINCT p.id) as position_count,
        COUNT(DISTINCT v.id) as total_votes
      FROM elections e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN positions p ON e.id = p.election_id
      LEFT JOIN votes v ON e.id = v.election_id
      WHERE e.id = ?
      GROUP BY e.id
    `, [election_id]);

    if (elections.length === 0) {
      return res.status(404).json({ success: false, message: 'Election not found' });
    }

    const election = elections[0];
    election.remaining = parseInt(election.countdown, 10) || 0;
    election.isActive = election.remaining > 0;

    // Get positions for this election
    const [positions] = await db.query(`
      SELECT 
        p.*,
        COUNT(DISTINCT c.id) as candidate_count
      FROM positions p
      LEFT JOIN candidates c ON p.id = c.position_id
      WHERE p.election_id = ?
      GROUP BY p.id
    `, [election_id]);

    res.json({
      success: true,
      data: {
        ...election,
        positions
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteElection = async (req, res, next) => {
  try {
    const { election_id } = req.params;

    // Check if election exists
    const [rows] = await db.query(
      'SELECT * FROM elections WHERE id = ?',
      [election_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    // Optional: delete related data first (to avoid FK constraint errors)
    await masterPool.query('DELETE FROM votes WHERE election_id = ?', [election_id]);
    await masterPool.query('DELETE FROM candidates WHERE position_id IN (SELECT id FROM positions WHERE election_id = ?)', [election_id]);
    await masterPool.query('DELETE FROM positions WHERE election_id = ?', [election_id]);

    // Delete the election
    await masterPool.query(
      'DELETE FROM elections WHERE id = ?',
      [election_id]
    );

    // Broadcast deletion (optional)
    broadcastElectionUpdate({
      id: parseInt(election_id),
      deleted: true
    });

    res.json({
      success: true,
      message: 'Election deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};