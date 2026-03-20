const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET /admin/dashboard - Admin dashboard
router.get(
  '/dashboard',
  authenticateToken,
  authorizeRole('admin'),
  adminController.getDashboard
);

module.exports = router;
