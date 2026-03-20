const express = require('express');
const router = express.Router();
const electionController = require('../controllers/electionController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createElectionValidation,
  updateElectionValidation
} = require('../validators/validators');

// POST /elections - Create election (Admin only)
router.post(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  createElectionValidation,
  validate,
  electionController.createElection
);

// PUT /elections/:election_id - Update election (Admin only)
router.put(
  '/:election_id',
  authenticateToken,
  authorizeRole('admin'),
  updateElectionValidation,
  validate,
  electionController.updateElection
);

// GET /elections - Get all elections
router.get('/', authenticateToken, electionController.getAllElections);

// GET /elections/:election_id - Get specific election
router.get('/:election_id', authenticateToken, electionController.getElectionById);

// DELETE /elections/:election_id - Delete election (Admin only)
router.delete(
  '/:election_id',
  authenticateToken,
  electionController.deleteElection
);

module.exports = router;
