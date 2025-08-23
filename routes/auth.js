const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getProfile,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateSignup, validateLogin } = require('../middleware/validation');

// Public routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;

