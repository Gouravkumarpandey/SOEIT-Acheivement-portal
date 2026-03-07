const express = require('express');
const router = express.Router();
const {
    createAchievement,
    getMyAchievements,
    getAchievement,
    updateAchievement,
    deleteAchievement,
    getPublicPortfolio,
    getPublicStudents,
    getStudentStats,
} = require('../controllers/achievementController');
const { protect, authorize, optionalProtect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes (with optional auth for identification)
router.get('/portfolio/:userId', optionalProtect, getPublicPortfolio);
router.get('/public-students', optionalProtect, getPublicStudents);

router.use(protect);

router.get('/stats', getStudentStats);
router.get('/my', getMyAchievements);
router.post('/', upload.array('proofFiles', 5), createAchievement);
router.get('/:id', getAchievement);
router.put('/:id', upload.array('proofFiles', 5), updateAchievement);
router.delete('/:id', deleteAchievement);

module.exports = router;

