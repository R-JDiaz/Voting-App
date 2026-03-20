const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createPositionValidation,
  updatePositionValidation
} = require('../validators/validators');

// POST /elections/:election_id/positions - Add position to election (Admin only)
router.post(
  '/elections/:election_id/positions',
  authenticateToken,
  authorizeRole('admin'),
  createPositionValidation,
  validate,
  positionController.createPosition
);

// PUT /positions/:position_id - Update position (Admin only)
router.put(
  '/positions/:position_id',
  authenticateToken,
  authorizeRole('admin'),
  updatePositionValidation,
  validate,
  positionController.updatePosition
);

// GET /positions/:position_id - Get specific position
router.get('/:position_id', authenticateToken, positionController.getPositionById);

// GET /elections/:election_id/positions - Get all positions for election
router.get(
  '/elections/:election_id/positions',
  authenticateToken,
  positionController.getPositionsByElection
);

// DELETE /positions/:position_id - Delete position (Admin only)
router.delete(
  '/positions/:position_id',
  authenticateToken,
  positionController.deletePosition
);

module.exports = router;
