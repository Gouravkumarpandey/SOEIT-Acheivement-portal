const Notification = require('./notification.model');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: 'User not identified' });
        }

        const notifications = await Notification.findByUser(req.user.id);
        
        if (!notifications || !Array.isArray(notifications)) {
             return res.status(200).json({ success: true, count: 0, data: [] });
        }

        const cleanedNotifications = notifications.map(notif => {
            if (!notif) return null;
            return notif.toObject ? notif.toObject() : notif;
        }).filter(Boolean);

        res.status(200).json({ success: true, count: cleanedNotifications.length, data: cleanedNotifications });
    } catch (error) {
        console.error('[Notification Controller] Error:', error);
        next(error);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) throw new Error('User not identified');
        await Notification.markAllAsRead(req.user.id);
        res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) throw new Error('User not identified');
        const notification = await Notification.findById(req.params.id);
        
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        
        if (notification.user !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        await notification.markAsRead();
        const cleanedNotification = notification.toObject ? notification.toObject() : notification;
        res.status(200).json({ success: true, message: 'Notification marked as read', data: cleanedNotification });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear all notifications
// @route   DELETE /api/notifications/clear-all
// @access  Private
exports.clearAll = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) throw new Error('User not identified');
        await Notification.deleteAllByUser(req.user.id);
        res.status(200).json({ success: true, message: 'All notifications cleared' });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user push token
// @route   PUT /api/notifications/push-token
// @access  Private
exports.updatePushToken = async (req, res, next) => {
    try {
        const { pushToken } = req.body;
        if (!req.user || !req.user.id) throw new Error('User not identified');

        const User = require('../user/user.model');
        await User.findByIdAndUpdate(req.user.id, { pushToken }, { new: true });

        res.status(200).json({ success: true, message: 'Push token updated' });
    } catch (error) {
        next(error);
    }
};
