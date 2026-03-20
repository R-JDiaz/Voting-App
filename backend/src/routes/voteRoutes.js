const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  submitVoteValidation,
  getResultsValidation
} = require('../validators/validators');

// POST /votes - Submit a vote
router.post(
  '/',
  authenticateToken,
  submitVoteValidation,
  validate,
  voteController.submitVote
);

// GET /votes/results/:election_id - Get election results
router.get(
  '/results/:election_id',
  authenticateToken,
  getResultsValidation,
  validate,
  voteController.getElectionResults
);

module.exports = router;
