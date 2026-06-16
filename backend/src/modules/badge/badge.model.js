const { getDb } = require('../../config/db');

const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const Badge = {
    /** Award a badge to a student */
    create: async (data) => {
        const db = getDb();
        const id = await genId();
        await db.query(
            `INSERT INTO badges (id, student_id, badge_type, week_start, points_earned)
              VALUES ($1, $2, $3, $4, $5)`,
            [id, data.studentId, data.badgeType, data.weekStart, data.pointsEarned]
        );
        return { id, ...data };
    },

    /** Find badges for a student */
    findByStudent: async (studentId) => {
        const db = getDb();
        const res = await db.query(
            `SELECT * FROM badges WHERE student_id = $1 ORDER BY created_at DESC`,
            [studentId]
        );
        return res.rows;
    },

    /** Get weekly top performers */
    getWeeklyTop: async (weekStart, limit = 10) => {
        const db = getDb();
        const res = await db.query(
            `SELECT b.*, u.name, u.profile_image, u.department
              FROM badges b
              JOIN users u ON b.student_id = u.id
              WHERE b.week_start = $1
              ORDER BY b.points_earned DESC
              LIMIT $2`,
            [weekStart, limit]
        );
        return res.rows;
    },

    /** Check if a student already has a badge for a specific week */
    hasBadgeForWeek: async (studentId, weekStart) => {
        const db = getDb();
        const res = await db.query(
            `SELECT id FROM badges WHERE student_id = $1 AND week_start = $2`,
            [studentId, weekStart]
        );
        return res.rows.length > 0;
    }
};

module.exports = Badge;
