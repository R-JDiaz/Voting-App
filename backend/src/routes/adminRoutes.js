const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRole, authorizePermission } = require('../middleware/auth');

// GET /admin/dashboard - Admin dashboard
router.get(
  '/dashboard',
  authenticateToken,
  authorizeRole('admin'),
  adminController.getDashboard
);
router.post('/create',authenticateToken,
  authorizeRole('admin'), adminController.createUser);

  router.patch('/block/:userId',authenticateToken,
  authorizeRole('admin'), adminController.toggleBlockUser);

  router.delete('/:userId',authenticateToken,
  authorizeRole('admin'), adminController.deleteUser);

  router.get('/users',authenticateToken,
  authorizeRole('admin'), adminController.getAllUsers);

  router.patch('/toggle-election/:userId',authenticateToken,
  authorizeRole('admin'), adminController.toggleElectionPermission);

module.exports = router;
