const { getDb } = require('../../config/db');

// nanoid - dynamic import helper
const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const Course = {
    /** CREATE */
    create: async (data) => {
        const db = getDb();
        const id = await genId();

        await db.query(
            `INSERT INTO courses 
                (id, student_id, course_name, platform, status, progress, start_date, course_link, sync_credentials, category, expected_completion_date, skills_to_be_learnt)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [
                id, data.studentId, data.courseName, data.platform,
                data.status || 'Ongoing', data.progress || 0, data.startDate || new Date().toISOString(),
                data.courseLink || '', data.syncCredentials || '{}',
                data.category || 'Technical', data.expectedCompletionDate || '', data.skillsToBeLearnt || ''
            ]
        );

        const result = await db.query('SELECT * FROM courses WHERE id=$1', [id]);
        return result.rows[0];
    },

    /** FIND BY ID */
    findById: async (id) => {
        const db = getDb();
        const result = await db.query('SELECT * FROM courses WHERE id=$1', [id]);
        return result.rows[0];
    },

    /** FIND BY STUDENT ID */
    findByStudentId: async (studentId) => {
        const db = getDb();
        const result = await db.query(
            'SELECT * FROM courses WHERE student_id=$1 ORDER BY created_at DESC',
            [studentId]
        );
        return result.rows;
    },

    /** UPDATE PROGRESS */
    updateProgress: async (id, progress, status, completionDate) => {
        const db = getDb();
        await db.query(
            `UPDATE courses SET 
                progress=$1, status=$2, completion_date=$3, updated_at=$4
                WHERE id=$5`,
            [progress, status, completionDate || null, new Date().toISOString(), id]
        );
        return Course.findById(id);
    },

    /** SYNC PROGRESS FROM EXTERNAL */
    sync: async (id, progress, status, credentials = null) => {
        const db = getDb();
        const now = new Date().toISOString();
        if (credentials) {
            await db.query(
                `UPDATE courses SET progress=$1, status=$2, last_synced_at=$3, updated_at=$4, sync_credentials=$5 WHERE id=$6`,
                [progress, status, now, now, JSON.stringify(credentials), id]
            );
        } else {
            await db.query(
                `UPDATE courses SET progress=$1, status=$2, last_synced_at=$3, updated_at=$4 WHERE id=$5`,
                [progress, status, now, now, id]
            );
        }
        return Course.findById(id);
    },

    /** DELETE */
    delete: async (id) => {
        const db = getDb();
        await db.query('DELETE FROM courses WHERE id=$1', [id]);
        return true;
    },

    /** GET ALL (Admin/Faculty View) */
    findAllEnriched: async (filters = {}) => {
        const db = getDb();
        let sql = `
            SELECT c.*, u.name as student_name, u.department, u.enrollment_no
            FROM courses c
            JOIN users u ON c.student_id = u.id
            WHERE 1=1
        `;
        const args = [];
        let paramIdx = 1;

        if (filters.department) {
            sql += ` AND u.department = $${paramIdx++}`;
            args.push(filters.department);
        }

        if (filters.status) {
            sql += ` AND c.status = $${paramIdx++}`;
            args.push(filters.status);
        }

        if (filters.search) {
            sql += ` AND (u.name ILIKE $${paramIdx} OR u.enrollment_no ILIKE $${paramIdx + 1} OR c.course_name ILIKE $${paramIdx + 2})`;
            const searchVal = `%${filters.search}%`;
            args.push(searchVal, searchVal, searchVal);
            paramIdx += 3;
        }

        sql += ' ORDER BY c.updated_at DESC';

        const result = await db.query(sql, args);
        return result.rows;
    }
};

module.exports = Course;
