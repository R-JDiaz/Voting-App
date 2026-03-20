const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const {
  registerValidation,
  loginValidation,
  refreshTokenValidation
} = require('../validators/validators');

// POST /auth/register - Register new user
router.post('/register', registerValidation, validate, authController.register);

// POST /auth/login - Login user
router.post('/login', loginValidation, validate, authController.login);

// POST /auth/logout - Logout user
router.post('/logout', authController.logout);

// POST /auth/refresh - Refresh JWT token
router.post('/refresh', refreshTokenValidation, validate, authController.refresh);

module.exports = router;
