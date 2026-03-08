const { getDb } = require('../config/db');

const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const File = {
    /** UPLOAD FILE TO DB */
    upload: async (buffer, filename, mimetype) => {
        const db = getDb();
        const id = await genId();

        await db.execute({
            sql: `INSERT INTO files (id, filename, mimetype, data) VALUES (?, ?, ?, ?)`,
            args: [id, filename, mimetype, buffer],
        });

        return id;
    },

    /** GET FILE FROM DB */
    findById: async (id) => {
        const db = getDb();
        const res = await db.execute({
            sql: `SELECT * FROM files WHERE id = ?`,
            args: [id],
        });

        if (res.rows.length === 0) return null;
        return res.rows[0];
    },

    /** DELETE FILE FROM DB */
    delete: async (id) => {
        const db = getDb();
        await db.execute({
            sql: `DELETE FROM files WHERE id = ?`,
            args: [id],
        });
    }
};

module.exports = File;
