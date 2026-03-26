const express = require('express');
const router = express.Router();
const electionController = require('../controllers/electionController');
const { authenticateToken, authorizeRole, authorizePermission } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createElectionValidation,
  updateElectionValidation
} = require('../validators/validators');

// ------------------------
// Create election (Admin only)
// ------------------------
router.post(
  '/',
  authenticateToken,
  authorizePermission('admin'),
  createElectionValidation,
  validate,
  electionController.createElection
);

// ------------------------
// Update election (Admin only)
// ------------------------
router.put(
  '/:election_id',
  authenticateToken,
  authorizePermission('admin'),
  updateElectionValidation,
  validate,
  electionController.updateElection
);

// ------------------------
// Delete election (Admin only)
// ------------------------
router.delete(
  '/:election_id',
  authenticateToken,
  authorizePermission('admin'),
  electionController.deleteElection
);

// ------------------------
// Get all elections
// Users see only elections they joined; admins see all
// ------------------------
router.get(
  '/',
  authenticateToken,
  electionController.getAllElections
);

// ------------------------
// Get specific election
// Users must have joined, admins bypass
// ------------------------
router.get(
  '/:election_id',
  authenticateToken,
  electionController.getElectionById
);

// ------------------------
// Join an election
// ------------------------
router.post(
  '/:election_id/join',
  authenticateToken,
  electionController.joinElection
);

module.exports = router;