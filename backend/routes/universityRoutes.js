const express = require('express');
const router = express.Router();
const { getUniversities, createUniversity, getUniversity, updateUniversity } = require('../controllers/universityController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getUniversities);
router.post('/', protect, authorize('admin'), createUniversity);
router.get('/:id', getUniversity);
router.put('/:id', protect, authorize('admin'), updateUniversity);

module.exports = router;
