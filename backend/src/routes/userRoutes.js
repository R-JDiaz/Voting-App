const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createUserValidation,
  updateUserValidation
} = require('../validators/validators');

// POST /users - Create user
router.post(
  '/',
  authenticateToken,
  createUserValidation,
  validate,
  userController.createUser
);

// GET /users/:user_id - Get user by ID
router.get('/:user_id', authenticateToken, userController.getUserById);

// PUT /users/:user_id - Update user
router.put(
  '/:user_id',
  authenticateToken,
  updateUserValidation,
  validate,
  userController.updateUser
);

// GET /users - Get all users (Admin only)
router.get('/', authenticateToken, authorizeRole('admin'), userController.getAllUsers);

module.exports = router;
