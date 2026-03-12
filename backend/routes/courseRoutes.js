const express = require('express');
const router = express.Router();
const { addCourse, getMyCourses, updateProgress, deleteCourse, getAllCourses } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');
const { cacheMiddleware } = require('../utils/cache');

router.use(protect);

// Student Routes
router.post('/', authorize('student'), addCourse);
router.get('/my', authorize('student'), cacheMiddleware(60), getMyCourses);
router.put('/:id/progress', authorize('student'), updateProgress);
router.delete('/:id', authorize('student'), deleteCourse);

// Admin / Faculty Routes
router.get('/', authorize('admin', 'faculty'), cacheMiddleware(120), getAllCourses);

module.exports = router;
