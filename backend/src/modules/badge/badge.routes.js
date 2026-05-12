const express = require('express');
const router = express.Router();
const { awardWeeklyBadges, getStudentBadges, getWeeklyLeaderboard } = require('./badge.controller');
const { protect, authorize, optionalProtect } = require('../../middleware/auth');

router.get('/student/:studentId', optionalProtect, getStudentBadges);
router.get('/leaderboard', optionalProtect, getWeeklyLeaderboard);

// Only faculty or admin can trigger manual badge calculation
router.post('/calculate', protect, authorize('faculty', 'admin'), awardWeeklyBadges);

module.exports = router;
