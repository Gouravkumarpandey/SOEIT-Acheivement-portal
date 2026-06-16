const { getDb } = require('../../config/db');
const zlib = require('zlib');
const { promisify } = require('util');

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const File = {
    /** UPLOAD FILE TO DB (Compressed) */
    upload: async (buffer, filename, mimetype) => {
        const db = getDb();
        const id = await genId();

        // Compress buffer before saving
        const compressedData = await gzip(buffer);

        await db.query(
            `INSERT INTO files (id, filename, mimetype, data) VALUES ($1, $2, $3, $4)`,
            [id, filename, mimetype, compressedData]
        );

        return id;
    },

    /** GET FILE FROM DB (Decompressed) */
    findById: async (id) => {
        const db = getDb();
        const res = await db.query(
            `SELECT * FROM files WHERE id = $1`,
            [id]
        );

        if (res.rows.length === 0) return null;

        const file = res.rows[0];

        // Try to decompress data (handle potential old uncompressed files)
        try {
            file.data = await gunzip(Buffer.from(file.data));
        } catch (err) {
            file.data = Buffer.from(file.data);
        }

        return file;
    },

    /** DELETE FILE FROM DB */
    delete: async (id) => {
        const db = getDb();
        await db.query(
            `DELETE FROM files WHERE id = $1`,
            [id]
        );
    }
};

module.exports = File;
