const bcrypt = require('bcryptjs');
const { masterPool, getAvailableSlave } = require('../config/database');
const db = getAvailableSlave();


// Get admin dashboard statistics
// Get admin dashboard statistics
exports.getDashboard = async (req, res, next) => {
  try {
    const db = getAvailableSlave();

    // Corrected total counts query
    const [stats] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM elections) AS total_elections,
        (SELECT COUNT(*) FROM elections WHERE status = 'active') AS active_elections,
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM votes) AS total_votes,
        (SELECT COUNT(*) FROM positions) AS total_positions,
        (SELECT COUNT(*) FROM candidates) AS total_candidates
    `);

    // Get recent elections
    const [recentElections] = await db.query(`
      SELECT 
        e.*,
        u.username AS created_by_username,
        COUNT(DISTINCT p.id) AS position_count,
        COUNT(DISTINCT v.id) AS vote_count
      FROM elections e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN positions p ON e.id = p.election_id
      LEFT JOIN votes v ON e.id = v.election_id
      GROUP BY e.id
      ORDER BY e.created_at DESC
      LIMIT 5
    `);

    // Get recent users
    const [recentUsers] = await db.query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        u.created_at,
        COUNT(v.id) AS votes_cast
      FROM users u
      LEFT JOIN votes v ON u.id = v.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT 10
    `);

    // Voting activity last 7 days
    const [votingActivity] = await db.query(`
      SELECT 
        DATE(voted_at) AS date,
        COUNT(*) AS vote_count
      FROM votes
      WHERE voted_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(voted_at)
      ORDER BY date ASC
    `);

    res.json({
      success: true,
      data: {
        statistics: stats[0],
        recentElections,
        recentUsers,
        votingActivity
      }
    });
  } catch (error) {
    next(error);
  }
};

// --------------------
// Create a regular user or admin (admin-only for admin creation)
// --------------------
exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Only admins can create admin users
    const userRole = req.user.role === 'admin' && role === 'admin' ? 'admin' : 'user';

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await masterPool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, password_hash, userRole]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { id: result.insertId, username, email, role: userRole }
    });
  } catch (error) {
    next(error);
  }
};

// --------------------
// Block or unblock a user (admin only)
// --------------------
exports.toggleBlockUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { userId } = req.params;
    const { block } = req.body; // true = block, false = unblock

    const [result] = await masterPool.query(
      'UPDATE users SET is_blocked = ? WHERE id = ?',
      [block ? 1 : 0, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: `User ${block ? 'blocked' : 'unblocked'} successfully` });
  } catch (error) {
    next(error);
  }
};

// --------------------
// Delete user (admin only)
// --------------------
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { userId } = req.params;

    const [result] = await masterPool.query(
      'DELETE FROM users WHERE id = ?',
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// --------------------
// Get all users (admin only)
// --------------------
exports.getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const [users] = await db.query(`
      SELECT 
        id, username, email, role, is_blocked, created_at, can_create_election
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

exports.toggleElectionPermission = async (req, res, next) => {
  try {

    const { userId } = req.params;
    const { allow } = req.body; // true = allow, false = disable

    const [result] = await masterPool.query(
      'UPDATE users SET can_create_election = ? WHERE id = ?',
      [allow, userId] // MySQL BOOLEAN maps directly to TRUE/FALSE
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: `User election creation ${allow ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    next(error);
  }
};