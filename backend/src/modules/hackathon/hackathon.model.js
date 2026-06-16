const { getDb } = require('../../config/db');

const genId = async () => {
    const crypto = require('crypto');
    return crypto.randomBytes(10).toString('hex');
};

const Hackathon = {
    create: async (data, userId) => {
        const db = getDb();
        const id = await genId();

        await db.query(
            `INSERT INTO hackathons (id, title, type, img_url, prize, students_count, deadline_date, badge, link, created_by)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                id, data.title, data.type, data.img_url || '',
                data.prize || '', data.students_count || '',
                data.deadline_date || '', data.badge || '',
                data.link, userId
            ]
        );

        const result = await db.query('SELECT * FROM hackathons WHERE id=$1', [id]);
        return result.rows[0];
    },

    findAll: async () => {
        const db = getDb();
        const result = await db.query(
            `SELECT h.*, u.name as creator_name 
              FROM hackathons h
              LEFT JOIN users u ON h.created_by = u.id
              ORDER BY h.created_at DESC`
        );
        return result.rows;
    },

    findById: async (id) => {
        const db = getDb();
        const result = await db.query(
            'SELECT * FROM hackathons WHERE id=$1',
            [id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        const db = getDb();
        await db.query('DELETE FROM hackathons WHERE id = $1', [id]);
    }
};

module.exports = Hackathon;
