const express = require('express');
const router = express.Router();
const { createNotice, getNotices, deleteNotice } = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getNotices);
router.post('/', authorize('admin', 'faculty'), createNotice);
router.delete('/:id', authorize('admin', 'faculty'), deleteNotice);

module.exports = router;
