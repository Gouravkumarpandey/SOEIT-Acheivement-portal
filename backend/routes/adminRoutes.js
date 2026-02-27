const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getPendingAchievements,
    verifyAchievement,
    getAllAchievements,
    getStudents,
    getFaculty,
    getReports,
    manageUser,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin', 'faculty'));

router.get('/dashboard', getDashboardStats);
router.get('/achievements/pending', getPendingAchievements);
router.get('/achievements', getAllAchievements);
router.get('/faculty', authorize('admin'), getFaculty);
router.put('/achievements/:id/verify', verifyAchievement);
router.get('/students', getStudents);
router.get('/reports', getReports);
router.put('/users/:id', authorize('admin'), manageUser);

module.exports = router;
