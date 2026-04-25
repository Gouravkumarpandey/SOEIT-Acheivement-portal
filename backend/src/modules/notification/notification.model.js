const { getDb } = require('../../config/db');
const { sendPushNotification } = require('./notification.service');
// We import User dynamically to avoid circular dependency if any
const getUserModel = () => require('../user/user.model');

const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const rowToNotification = (row) => {
    if (!row) return null;
    return {
        _id: row.id,
        id: row.id,
        user: row.user_id,
        type: row.type, // 'notice', 'event', 'achievement', 'internship', etc.
        title: row.title,
        message: row.message,
        link: row.link,
        isRead: !!row.is_read,
        createdAt: row.created_at ? new Date(row.created_at) : null,

        markAsRead: async function () {
            const db = getDb();
            await db.execute({ sql: 'UPDATE notifications SET is_read = 1 WHERE id = ?', args: [this.id] });
            this.isRead = true;
        },

        delete: async function () {
            const db = getDb();
            await db.execute({ sql: 'DELETE FROM notifications WHERE id = ?', args: [this.id] });
        },

        toObject: function () {
            const obj = { ...this };
            delete obj.markAsRead;
            delete obj.delete;
            delete obj.toObject;
            return obj;
        },
    };
};

const Notification = {
    create: async (data) => {
        const db = getDb();
        const id = await genId();
        await db.execute({
            sql: `INSERT INTO notifications (id, user_id, type, title, message, link)
                  VALUES (?,?,?,?,?,?)`,
            args: [id, data.user, data.type, data.title, data.message, data.link || null],
        });
        const res = await db.execute({ sql: 'SELECT * FROM notifications WHERE id = ?', args: [id] });
        const notification = rowToNotification(res.rows[0]);

        // Send push notification
        if (notification) {
            const User = getUserModel();
            const user = await User.findById(data.user);
            if (user && user.pushToken) {
                sendPushNotification([user.pushToken], data.title, data.message, { type: data.type, link: data.link });
            }
        }

        return notification;
    },

    createMany: async (notifications) => {
        const db = getDb();
        // Since we are using execute with args, we might need to do them one by one or batch if supported
        // For simplicity and safety with LibSQL, let's do one by one or a transaction
        const created = [];
        for (const data of notifications) {
            const id = await genId();
            await db.execute({
                sql: `INSERT INTO notifications (id, user_id, type, title, message, link)
                      VALUES (?,?,?,?,?,?)`,
                args: [id, data.user, data.type, data.title, data.message, data.link || null],
            });
            created.push(id);
        }
        // Send push notifications for all (grouped by user token)
        const User = getUserModel();
        const userTokens = {};
        for (const data of notifications) {
            if (!userTokens[data.user]) {
                const user = await User.findById(data.user);
                userTokens[data.user] = user ? user.pushToken : null;
            }
            if (userTokens[data.user]) {
                sendPushNotification([userTokens[data.user]], data.title, data.message, { type: data.type, link: data.link });
            }
        }

        return created;
    },

    findByUser: async (userId) => {
        const db = getDb();
        const res = await db.execute({
            sql: 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
            args: [userId]
        });
        return res.rows.map(rowToNotification);
    },

    markAllAsRead: async (userId) => {
        const db = getDb();
        await db.execute({
            sql: 'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
            args: [userId]
        });
    },

    findById: async (id) => {
        const db = getDb();
        const res = await db.execute({ sql: 'SELECT * FROM notifications WHERE id = ?', args: [id] });
        return res.rows.length ? rowToNotification(res.rows[0]) : null;
    },

    deleteAllByUser: async (userId) => {
        const db = getDb();
        await db.execute({
            sql: 'DELETE FROM notifications WHERE user_id = ?',
            args: [userId]
        });
    }
};

module.exports = Notification;
