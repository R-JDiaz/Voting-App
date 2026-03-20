const {masterPool, getAvailableSlave} = require('../config/database');
const { broadcastElectionFromPosition } = require('../helpers/electionHelpers');

const db = getAvailableSlave();

// Add position to election (Admin only)
exports.createPosition = async (req, res, next) => {
  try {
    const { election_id } = req.params;
    const { name, description } = req.body;

    // Check if election exists
    const [elections] = await db.query('SELECT id FROM elections WHERE id = ?', [election_id]);
    if (elections.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    const [result] = await masterPool.query(
      'INSERT INTO positions (election_id, name, description) VALUES (?, ?, ?)',
      [election_id, name, description || null]
    );

    await broadcastElectionFromPosition(election_id);

    res.status(201).json({
      success: true,
      message: 'Position created successfully',
      data: {
        id: result.insertId,
        election_id,
        name,
        description
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update position (Admin only)
exports.updatePosition = async (req, res, next) => {
  try {
    const { position_id } = req.params;
    const { name, description } = req.body;

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(position_id);

    const [result] = await masterPool.query(
      `UPDATE positions SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }

    // Fetch the election_id for this position
    const [positionData] = await db.query(
      'SELECT election_id FROM positions WHERE id = ?',
      [position_id]
    );

    if (positionData.length > 0) {
      const election_id = positionData[0].election_id;
      await broadcastElectionFromPosition(election_id); // broadcast update to frontend
    }

    res.json({
      success: true,
      message: 'Position updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get position by ID
exports.getPositionById = async (req, res, next) => {
  try {
    const { position_id } = req.params;

    const [positions] = await db.query(`
      SELECT 
        p.*,
        e.title as election_title,
        COUNT(DISTINCT c.id) as candidate_count
      FROM positions p
      LEFT JOIN elections e ON p.election_id = e.id
      LEFT JOIN candidates c ON p.id = c.position_id
      WHERE p.id = ?
      GROUP BY p.id
    `, [position_id]);

    if (positions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }

    res.json({
      success: true,
      data: positions[0]
    });
  } catch (error) {
    next(error);
  }
};

// Get all positions for an election
exports.getPositionsByElection = async (req, res, next) => {
  try {
    const { election_id } = req.params;

    const [positions] = await db.query(`
      SELECT 
        p.*,
        COUNT(DISTINCT c.id) as candidate_count
      FROM positions p
      LEFT JOIN candidates c ON p.id = c.position_id
      WHERE p.election_id = ?
      GROUP BY p.id
      ORDER BY p.created_at ASC
    `, [election_id]);

    res.json({
      success: true,
      data: positions
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------
// Delete position (Admin only)
// ------------------------
exports.deletePosition = async (req, res, next) => {
  try {
    const { position_id } = req.params;

    // Check if position exists
    const [rows] = await db.query(
      'SELECT election_id FROM positions WHERE id = ?',
      [position_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }

    const election_id = rows[0].election_id;

    // Delete related candidates first (avoid FK issues)
    await masterPool.query(
      'DELETE FROM candidates WHERE position_id = ?',
      [position_id]
    );

    // Delete the position
    await masterPool.query(
      'DELETE FROM positions WHERE id = ?',
      [position_id]
    );

    // Broadcast updated election data
    await broadcastElectionFromPosition(election_id);

    res.json({
      success: true,
      message: 'Position deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};