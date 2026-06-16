const { getDb } = require('../../config/db');

const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const CourseAssignment = {
    create: async (data, assignedBy) => {
        const db = getDb();
        const id = await genId();

        await db.query(
            `INSERT INTO course_assignments 
                (id, course_name, subject, description, course_link, department, semester, assigned_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                id, data.courseName, data.subject, data.description || '',
                data.courseLink || '', data.department, data.semester, assignedBy
            ]
        );

        const result = await db.query('SELECT * FROM course_assignments WHERE id=$1', [id]);
        return result.rows[0];
    },

    findAll: async (filters = {}) => {
        const db = getDb();
        let sql = `
            SELECT ca.*, u.name as faculty_name
            FROM course_assignments ca
            JOIN users u ON ca.assigned_by = u.id
            WHERE 1=1
        `;
        const args = [];
        let paramIdx = 1;

        if (filters.department) {
            sql += ` AND ca.department = $${paramIdx++}`;
            args.push(filters.department);
        }

        if (filters.semester) {
            sql += ` AND ca.semester = $${paramIdx++}`;
            args.push(filters.semester);
        }

        sql += ' ORDER BY ca.created_at DESC';

        const result = await db.query(sql, args);
        return result.rows;
    },

    findByStudentTarget: async (department, semester) => {
        const db = getDb();
        const result = await db.query(
            `SELECT ca.*, u.name as faculty_name 
             FROM course_assignments ca
             JOIN users u ON ca.assigned_by = u.id
             WHERE ca.department = $1 AND ca.semester = $2
             ORDER BY ca.created_at DESC`,
            [department, semester]
        );
        return result.rows;
    },

    delete: async (id) => {
        const db = getDb();
        await db.query('DELETE FROM course_assignments WHERE id=$1', [id]);
        return true;
    }
};

module.exports = CourseAssignment;
