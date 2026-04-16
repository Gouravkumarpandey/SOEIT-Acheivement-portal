const express = require('express');
const router = express.Router();
const { awardWeeklyBadges, getStudentBadges, getWeeklyLeaderboard } = require('./badge.controller');
const { protect, authorize } = require('../../middleware/auth');

router.get('/student/:studentId', protect, getStudentBadges);
router.get('/leaderboard', protect, getWeeklyLeaderboard);

// Only faculty or admin can trigger manual badge calculation
router.post('/calculate', protect, authorize('faculty', 'admin'), awardWeeklyBadges);

module.exports = router;
