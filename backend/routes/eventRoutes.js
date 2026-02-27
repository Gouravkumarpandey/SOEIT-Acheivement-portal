const express = require('express');
const router = express.Router();
const { createEvent, getEvents, deleteEvent, updateEvent } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getEvents);
router.post('/', authorize('admin', 'faculty'), createEvent);
router.put('/:id', authorize('admin', 'faculty'), updateEvent);
router.delete('/:id', authorize('admin', 'faculty'), deleteEvent);

module.exports = router;
