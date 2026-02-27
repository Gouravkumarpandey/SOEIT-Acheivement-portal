const express = require('express');
const router = express.Router();
const {
    createAchievement,
    getMyAchievements,
    getAchievement,
    updateAchievement,
    deleteAchievement,
    getPublicPortfolio,
    getStudentStats,
} = require('../controllers/achievementController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/portfolio/:userId', getPublicPortfolio);
router.use(protect);

router.get('/stats', getStudentStats);
router.get('/my', getMyAchievements);
router.post('/', upload.array('proofFiles', 5), createAchievement);
router.get('/:id', getAchievement);
router.put('/:id', upload.array('proofFiles', 5), updateAchievement);
router.delete('/:id', deleteAchievement);

module.exports = router;
