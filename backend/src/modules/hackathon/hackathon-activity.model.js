const { getDb } = require('../../config/db');

const genId = async () => {
    const crypto = require('crypto');
    return crypto.randomBytes(10).toString('hex');
};

const HackathonActivity = {
    /** Log a new activity */
    create: async (data) => {
        const db = getDb();
        const id = await genId();

        await db.query(
            `INSERT INTO hackathon_activities (id, student_id, hackathon_title, action_type) VALUES ($1, $2, $3, $4)`,
            [id, data.studentId, data.hackathonTitle, data.actionType || 'visit']
        );

        const result = await db.query('SELECT * FROM hackathon_activities WHERE id=$1', [id]);
        return result.rows[0];
    },

    /** Fetch all activities enriched with student details (for admin/faculty) */
    findAllEnriched: async (filters = {}) => {
        const db = getDb();
        let sql = `
            SELECT h.*, u.name as student_name, u.department, u.enrollment_no, u.batch
            FROM hackathon_activities h
            JOIN users u ON h.student_id = u.id
            WHERE 1=1
        `;
        const args = [];
        let paramIdx = 1;

        if (filters.department) {
            sql += ` AND u.department = $${paramIdx++}`;
            args.push(filters.department);
        }

        if (filters.search) {
            sql += ` AND (u.name ILIKE $${paramIdx} OR u.enrollment_no ILIKE $${paramIdx + 1} OR h.hackathon_title ILIKE $${paramIdx + 2})`;
            const searchVal = `%${filters.search}%`;
            args.push(searchVal, searchVal, searchVal);
            paramIdx += 3;
        }

        sql += ' ORDER BY h.created_at DESC';

        const result = await db.query(sql, args);
        return result.rows;
    },

    /** Count distinct hackathons a student has explored */
    countByStudent: async (studentId) => {
        const db = getDb();
        const result = await db.query(
            `SELECT COUNT(DISTINCT hackathon_title) as cnt FROM hackathon_activities WHERE student_id = $1`,
            [studentId]
        );
        return Number(result.rows[0]?.cnt) || 0;
    },

    /** Delete an activity log */
    delete: async (id) => {
        const db = getDb();
        await db.query('DELETE FROM hackathon_activities WHERE id = $1', [id]);
    }
};

module.exports = HackathonActivity;
