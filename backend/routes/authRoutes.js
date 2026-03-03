const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, changePassword, forgotPassword, resetPassword, logout, refreshToken } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/login', login);
router.get('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
