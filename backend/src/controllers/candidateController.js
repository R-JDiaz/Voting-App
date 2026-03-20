const {masterPool, getAvailableSlave } = require('../config/database');
const { broadcastElectionFromCandidate } = require('../helpers/candidateHelpers');

const db = getAvailableSlave();
// Add candidate to position (Admin only)
exports.createCandidate = async (req, res, next) => {
  try {
    const { position_id } = req.params;
    const { name } = req.body;

    // Check if position exists
    const [positions] = await db.query('SELECT id FROM positions WHERE id = ?', [position_id]);
    if (positions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }

    const [result] = await masterPool.query(
      'INSERT INTO candidates (position_id, name) VALUES (?, ?)',
      [position_id, name]
    );

    await broadcastElectionFromCandidate(position_id);

    res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      data: {
        id: result.insertId,
        position_id,
        name
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update candidate (Admin only)
exports.updateCandidate = async (req, res, next) => {
  try {
    const { candidate_id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    // Update candidate
    const [result] = await masterPool.query(
      'UPDATE candidates SET name = ? WHERE id = ?',
      [name, candidate_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Get the position_id of this candidate
    const [candidateData] = await db.query(
      'SELECT position_id FROM candidates WHERE id = ?',
      [candidate_id]
    );

    if (candidateData.length > 0) {
      const position_id = candidateData[0].position_id;
      await broadcastElectionFromCandidate(position_id); // Broadcast after update
    }

    res.json({
      success: true,
      message: 'Candidate updated successfully'
    });

  } catch (error) {
    next(error);
  }
};

// Get candidate by ID
exports.getCandidateById = async (req, res, next) => {
  try {
    const { candidate_id } = req.params;

    const [candidates] = await db.query(`
      SELECT 
        c.*,
        p.name as position_name,
        p.election_id,
        e.title as election_title,
        COUNT(v.id) as vote_count
      FROM candidates c
      LEFT JOIN positions p ON c.position_id = p.id
      LEFT JOIN elections e ON p.election_id = e.id
      LEFT JOIN votes v ON c.id = v.candidate_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [candidate_id]);

    if (candidates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    res.json({
      success: true,
      data: candidates[0]
    });
  } catch (error) {
    next(error);
  }
};

// Get all candidates for a position
exports.getCandidatesByPosition = async (req, res, next) => {
  try {
    const { position_id } = req.params;

    const [candidates] = await db.query(`
      SELECT 
        c.*,
        COUNT(v.id) as vote_count
      FROM candidates c
      LEFT JOIN votes v ON c.id = v.candidate_id
      WHERE c.position_id = ?
      GROUP BY c.id
      ORDER BY c.created_at ASC
    `, [position_id]);

    res.json({
      success: true,
      data: candidates
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------
// Delete candidate (Admin only)
// ------------------------
exports.deleteCandidate = async (req, res, next) => {
  try {
    const { candidate_id } = req.params;

    // Check if candidate exists
    const [rows] = await db.query(
      'SELECT position_id FROM candidates WHERE id = ?',
      [candidate_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    const position_id = rows[0].position_id;

    // Delete related votes first (avoid FK constraint issues)
    await masterPool.query(
      'DELETE FROM votes WHERE candidate_id = ?',
      [candidate_id]
    );

    // Delete the candidate
    await masterPool.query(
      'DELETE FROM candidates WHERE id = ?',
      [candidate_id]
    );

    // Broadcast updated election data
    await broadcastElectionFromCandidate(position_id);

    res.json({
      success: true,
      message: 'Candidate deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};