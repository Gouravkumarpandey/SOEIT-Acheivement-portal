const { getDb } = require('../../config/db');

const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const rowToProject = (row) => {
    if (!row) return null;
    return {
        _id: row.id,
        id: row.id,
        studentId: row.student_id,
        title: row.title,
        description: row.description,
        githubLink: row.github_link,
        liveLink: row.live_link,
        techStack: row.tech_stack,
        status: row.status,
        createdAt: row.created_at ? new Date(row.created_at) : null,
        updatedAt: row.updated_at ? new Date(row.updated_at) : null,
        student: row.student_name ? {
            name: row.student_name,
            email: row.student_email,
            department: row.student_department,
            profileImage: row.student_profile_image
        } : undefined
    };
};

const Project = {
    create: async (data) => {
        const db = getDb();
        const id = await genId();
        await db.query(
            `INSERT INTO projects (id, student_id, title, description, github_link, live_link, tech_stack, status)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [id, data.studentId, data.title, data.description, data.githubLink || null, data.liveLink || null, data.techStack || null, data.status || 'Completed']
        );
        return Project.findById(id);
    },

    findById: async (id) => {
        const db = getDb();
        const res = await db.query(
            `SELECT p.*, u.name as student_name, u.email as student_email, u.department as student_department, u.profile_image as student_profile_image
              FROM projects p
              LEFT JOIN users u ON p.student_id = u.id
              WHERE p.id = $1`,
            [id]
        );
        return res.rows.length ? rowToProject(res.rows[0]) : null;
    },

    findAll: async (params = {}) => {
        const db = getDb();
        let sql = `SELECT p.*, u.name as student_name, u.email as student_email, u.department as student_department, u.profile_image as student_profile_image
                   FROM projects p
                   LEFT JOIN users u ON p.student_id = u.id
                   WHERE 1=1`;
        const args = [];
        let paramIdx = 1;

        if (params.studentId) {
            sql += ` AND p.student_id = $${paramIdx++}`;
            args.push(params.studentId);
        }

        if (params.department) {
            sql += ` AND u.department = $${paramIdx++}`;
            args.push(params.department);
        }

        if (params.search) {
            sql += ` AND (p.title ILIKE $${paramIdx} OR p.tech_stack ILIKE $${paramIdx + 1} OR u.name ILIKE $${paramIdx + 2})`;
            args.push(`%${params.search}%`, `%${params.search}%`, `%${params.search}%`);
            paramIdx += 3;
        }

        sql += ` ORDER BY p.created_at DESC`;

        const res = await db.query(sql, args);
        return res.rows.map(rowToProject);
    },

    delete: async (id, studentId) => {
        const db = getDb();
        await db.query(
            `DELETE FROM projects WHERE id = $1 AND student_id = $2`,
            [id, studentId]
        );
    }
};

module.exports = Project;
