const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead, clearAll } = require('./notification.controller');
const { protect } = require('../../middleware/auth');

router.use(protect);

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.delete('/clear-all', clearAll);
router.put('/:id/read', markAsRead);

module.exports = router;
