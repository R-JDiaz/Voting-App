const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createCandidateValidation,
  updateCandidateValidation
} = require('../validators/validators');

// POST /positions/:position_id/candidates - Add candidate to position (Admin only)
router.post(
  '/positions/:position_id/candidates',
  authenticateToken,
  authorizeRole('admin'),
  createCandidateValidation,
  validate,
  candidateController.createCandidate
);

// PUT /candidates/:candidate_id - Update candidate (Admin only)
router.put(
  '/candidates/:candidate_id',
  authenticateToken,
  authorizeRole('admin'),
  updateCandidateValidation,
  validate,
  candidateController.updateCandidate
);

// GET /candidates/:candidate_id - Get specific candidate
router.get('/:candidate_id', authenticateToken, candidateController.getCandidateById);

// GET /positions/:position_id/candidates - Get all candidates for position
router.get(
  '/positions/:position_id/candidates',
  authenticateToken,
  candidateController.getCandidatesByPosition
);

// DELETE /candidates/:candidate_id - Delete candidate (Admin only)
router.delete(
  '/candidates/:candidate_id',
  authenticateToken,
  candidateController.deleteCandidate
);
module.exports = router;
