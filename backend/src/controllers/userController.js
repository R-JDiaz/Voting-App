const bcrypt = require('bcryptjs');
const { masterPool, getAvailableSlave } = require('../config/database');

const db = getAvailableSlave();

// Create user (Admin or self-register)
exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password, role, can_create_election } = req.body;

    // Only admins can create admin users
    const userRole = req.user.role === 'admin' && role === 'admin' ? 'admin' : 'user';

    // Only admins can set the 'can_create_election' permission
    const canCreateElection = req.user.role === 'admin' ? !!can_create_election : false;

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await masterPool.query(
      `INSERT INTO users (username, email, password_hash, role, can_create_election) 
       VALUES (?, ?, ?, ?, ?)`,
      [username, email, password_hash, userRole, canCreateElection]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: result.insertId,
        username,
        email,
        role: userRole,
        can_create_election: canCreateElection
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    if (req.user.role !== 'admin' && req.user.id !== parseInt(user_id)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this user'
      });
    }

    const [users] = await db.query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        u.can_create_election,
        u.created_at,
        COUNT(DISTINCT v.id) as votes_cast
      FROM users u
      LEFT JOIN votes v ON u.id = v.user_id
      WHERE u.id = ?
      GROUP BY u.id
    `, [user_id]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    next(error);
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { username, email, password, can_create_election } = req.body;

    if (req.user.role !== 'admin' && req.user.id !== parseInt(user_id)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this user'
      });
    }

    const updates = [];
    const values = [];

    if (username !== undefined) {
      updates.push('username = ?');
      values.push(username);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (password !== undefined) {
      const password_hash = await bcrypt.hash(password, 10);
      updates.push('password_hash = ?');
      values.push(password_hash);
    }
    // Only admins can update the 'can_create_election' field
    if (can_create_election !== undefined && req.user.role === 'admin') {
      updates.push('can_create_election = ?');
      values.push(!!can_create_election);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(user_id);

    const [result] = await db.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const [users] = await db.query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        u.can_create_election,
        u.created_at,
        COUNT(DISTINCT v.id) as votes_cast
      FROM users u
      LEFT JOIN votes v ON u.id = v.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};