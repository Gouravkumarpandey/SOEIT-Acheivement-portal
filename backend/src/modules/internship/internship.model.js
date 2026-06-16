const { getDb } = require('../../config/db');

const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const rowToInternship = (row) => {
    if (!row) return null;
    return {
        ...row,
        _id: row.id,
    };
};

const Internship = {
    /** CREATE */
    create: async (data) => {
        const db = getDb();
        const id = await genId();

        await db.query(
            `INSERT INTO internships 
                (id, student_id, company_name, role, start_date, end_date, status, description, certificate_url, location, internship_type)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
                id, data.studentId, data.companyName, data.role,
                data.startDate, data.endDate || null, data.status || 'Ongoing',
                data.description || null, data.certificateUrl || null,
                data.location || null, data.internshipType || null
            ]
        );

        const result = await db.query('SELECT * FROM internships WHERE id=$1', [id]);
        return rowToInternship(result.rows[0]);
    },

    /** FIND BY ID */
    findById: async (id) => {
        const db = getDb();
        const result = await db.query('SELECT * FROM internships WHERE id=$1', [id]);
        return result.rows.length ? rowToInternship(result.rows[0]) : null;
    },

    /** FIND BY STUDENT ID */
    findByStudentId: async (studentId) => {
        const db = getDb();
        const result = await db.query(
            'SELECT * FROM internships WHERE student_id=$1 ORDER BY created_at DESC',
            [studentId]
        );
        return result.rows.map(rowToInternship);
    },

    /** UPDATE */
    update: async (id, data) => {
        const db = getDb();
        const fields = [];
        const args = [];
        let paramIdx = 1;

        if (data.companyName) { fields.push(`company_name=$${paramIdx++}`); args.push(data.companyName); }
        if (data.role) { fields.push(`role=$${paramIdx++}`); args.push(data.role); }
        if (data.startDate) { fields.push(`start_date=$${paramIdx++}`); args.push(data.startDate); }
        if (data.endDate) { fields.push(`end_date=$${paramIdx++}`); args.push(data.endDate); }
        if (data.status) { fields.push(`status=$${paramIdx++}`); args.push(data.status); }
        if (data.description) { fields.push(`description=$${paramIdx++}`); args.push(data.description); }
        if (data.certificateUrl) { fields.push(`certificate_url=$${paramIdx++}`); args.push(data.certificateUrl); }
        if (data.location) { fields.push(`location=$${paramIdx++}`); args.push(data.location); }
        if (data.internshipType) { fields.push(`internship_type=$${paramIdx++}`); args.push(data.internshipType); }

        if (fields.length === 0) return Internship.findById(id);

        fields.push(`updated_at=$${paramIdx++}`);
        args.push(new Date().toISOString());
        args.push(id);

        await db.query(
            `UPDATE internships SET ${fields.join(', ')} WHERE id=$${paramIdx}`,
            args
        );
        return Internship.findById(id);
    },

    /** DELETE */
    delete: async (id) => {
        const db = getDb();
        await db.query('DELETE FROM internships WHERE id=$1', [id]);
        return true;
    },

    /** GET ALL (Admin/Faculty View) */
    findAllEnriched: async (filters = {}) => {
        const db = getDb();
        let sql = `
            SELECT i.*, u.name as student_name, u.department, u.enrollment_no, u.profile_image as student_profile_image
            FROM internships i
            JOIN users u ON i.student_id = u.id
            WHERE 1=1
        `;
        const args = [];
        let paramIdx = 1;

        if (filters.department) {
            sql += ` AND u.department = $${paramIdx++}`;
            args.push(filters.department);
        }

        if (filters.status) {
            sql += ` AND i.status = $${paramIdx++}`;
            args.push(filters.status);
        }

        if (filters.search) {
            sql += ` AND (u.name ILIKE $${paramIdx} OR u.enrollment_no ILIKE $${paramIdx + 1} OR i.company_name ILIKE $${paramIdx + 2} OR i.role ILIKE $${paramIdx + 3})`;
            const searchVal = `%${filters.search}%`;
            args.push(searchVal, searchVal, searchVal, searchVal);
            paramIdx += 4;
        }

        sql += ' ORDER BY i.created_at DESC';

        const result = await db.query(sql, args);
        return result.rows.map(rowToInternship);
    }
};

module.exports = Internship;
