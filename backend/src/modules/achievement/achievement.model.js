const { getDb } = require('../../config/db');

const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const { calculatePoints } = require('../../utils/scoring');

const rowToAchievement = (row) => {
    if (!row) return null;
    return {
        _id: row.id,
        id: row.id,
        studentId: row.student_id,
        title: row.title,
        category: row.category,
        description: row.description,
        level: row.level,
        date: row.date ? new Date(row.date) : null,
        institution: row.institution,
        certificateUrl: row.certificate_url || '',
        proofFiles: (() => { try { return JSON.parse(row.proof_files || '[]'); } catch { return []; } })(),
        status: row.status || 'pending',
        remarks: row.remarks,
        verifiedBy: row.verified_by || null,
        verifiedAt: row.verified_at ? new Date(row.verified_at) : null,
        isPublic: row.is_public === 1 || row.is_public === true,
        tags: (() => { try { return JSON.parse(row.tags || '[]'); } catch { return []; } })(),
        points: row.points || 0,
        createdAt: row.created_at ? new Date(row.created_at) : null,
        updatedAt: row.updated_at ? new Date(row.updated_at) : null,

        student: row.student_name ? {
            _id: row.student_id,
            id: row.student_id,
            name: row.student_name,
            email: row.student_email,
            department: row.student_department,
            studentId: row.student_student_id,
            profileImage: row.student_profile_image || '',
        } : undefined,

        verifier: row.verifier_name ? {
            _id: row.verified_by,
            id: row.verified_by,
            name: row.verifier_name,
            role: row.verifier_role,
        } : undefined,

        populate: async function () { return this; },

        deleteOne: async function () {
            const db = getDb();
            const client = await db.connect();
            try {
                await client.query('BEGIN');
                await client.query('DELETE FROM verifications WHERE achievement_id = $1', [this.id]);
                await client.query('DELETE FROM achievements WHERE id = $1', [this.id]);
                await client.query('COMMIT');
            } catch (err) {
                await client.query('ROLLBACK');
                throw err;
            } finally {
                client.release();
            }
        },

        save: async function () {
            const db = getDb();
            await db.query(
                `UPDATE achievements SET
                    student_id=$1, title=$2, category=$3, description=$4, level=$5, date=$6,
                    institution=$7, certificate_url=$8, proof_files=$9, status=$10, remarks=$11,
                    verified_by=$12, verified_at=$13, is_public=$14, tags=$15, points=$16,
                    updated_at=$17
                  WHERE id=$18`,
                [
                    this.studentId, this.title, this.category, this.description,
                    this.level, this.date ? new Date(this.date).toISOString() : null,
                    this.institution || null,
                    this.certificateUrl || '',
                    JSON.stringify(this.proofFiles || []),
                    this.status,
                    this.remarks || null,
                    this.verifiedBy || null,
                    this.verifiedAt ? new Date(this.verifiedAt).toISOString() : null,
                    this.isPublic ? 1 : 0,
                    JSON.stringify(this.tags || []),
                    this.points || 0,
                    new Date().toISOString(),
                    this.id,
                ]
            );
            return this;
        },
    };
};

const BASE_SELECT = `
    SELECT
        a.*,
        u.name        AS student_name,
        u.email       AS student_email,
        u.department  AS student_department,
        u.student_id  AS student_student_id,
        u.profile_image AS student_profile_image,
        v.name        AS verifier_name,
        v.role        AS verifier_role
    FROM achievements a
    LEFT JOIN users u ON a.student_id = u.id
    LEFT JOIN users v ON a.verified_by = v.id
`;

const Achievement = {
    /** CREATE */
    create: async (data) => {
        const db = getDb();
        const id = await genId();
        const pts = calculatePoints(data);

        await db.query(
            `INSERT INTO achievements
                (id, student_id, title, category, description, level, date,
                 institution, certificate_url, proof_files, status, is_public, tags, points)
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
            [
                id,
                data.studentId,
                data.title,
                data.category,
                data.description,
                data.level,
                data.date ? new Date(data.date).toISOString() : null,
                data.institution || null,
                data.certificateUrl || '',
                JSON.stringify(data.proofFiles || []),
                data.status || 'pending',
                data.isPublic !== undefined ? (data.isPublic ? 1 : 0) : 1,
                JSON.stringify(data.tags || []),
                pts,
            ]
        );

        const res = await db.query(`${BASE_SELECT} WHERE a.id = $1`, [id]);
        return rowToAchievement(res.rows[0]);
    },

    /** FIND BY ID */
    findById: async (id) => {
        const db = getDb();
        const res = await db.query(`${BASE_SELECT} WHERE a.id = $1`, [id]);
        return res.rows.length ? rowToAchievement(res.rows[0]) : null;
    },

    /** FIND — chainable */
    find: (query = {}) => {
        let _sort = null;
        let _skip = 0;
        let _limit = null;

        const buildAndExec = async () => {
            const db = getDb();
            let sql = `${BASE_SELECT} WHERE 1=1`;
            const args = [];
            let paramIdx = 1;

            if (query.studentId) {
                if (typeof query.studentId === 'object' && query.studentId.$in) {
                    const ids = query.studentId.$in;
                    if (ids.length > 0) {
                        const placeholders = ids.map((_, i) => `$${paramIdx + i}`).join(',');
                        sql += ` AND a.student_id IN (${placeholders})`;
                        args.push(...ids);
                        paramIdx += ids.length;
                    } else {
                        sql += ' AND 1=0';
                    }
                } else {
                    sql += ` AND a.student_id = $${paramIdx++}`;
                    args.push(query.studentId);
                }
            }
            if (query.status) { sql += ` AND a.status = $${paramIdx++}`; args.push(query.status); }
            if (query.category) { sql += ` AND a.category = $${paramIdx++}`; args.push(query.category); }
            if (query.level) { sql += ` AND a.level = $${paramIdx++}`; args.push(query.level); }
            if (query.isPublic !== undefined) { sql += ` AND a.is_public = $${paramIdx++}`; args.push(query.isPublic ? 1 : 0); }

            if (_sort) {
                const [field, dir] = Object.entries(_sort)[0];
                const colMap = { createdAt: 'a.created_at', date: 'a.date', points: 'a.points' };
                sql += ` ORDER BY ${colMap[field] || field} ${dir === -1 ? 'DESC' : 'ASC'}`;
            } else {
                sql += ' ORDER BY a.created_at DESC';
            }
            if (_limit && _skip) sql += ` LIMIT ${_limit} OFFSET ${_skip}`;
            else if (_limit) sql += ` LIMIT ${_limit}`;
            else if (_skip) sql += ` OFFSET ${_skip}`;

            const res = await db.query(sql, args);
            return res.rows.map(rowToAchievement);
        };

        const chain = {
            select: () => chain,
            populate: () => chain,
            sort: (s) => { _sort = s; return chain; },
            skip: (n) => { _skip = n; return chain; },
            limit: (n) => { _limit = n; return chain; },
            then: (resolve, reject) => buildAndExec().then(resolve, reject),
        };
        return chain;
    },

    /** COUNT */
    countDocuments: async (query = {}) => {
        const db = getDb();
        let sql = 'SELECT COUNT(*) as cnt FROM achievements WHERE 1=1';
        const args = [];
        let paramIdx = 1;

        if (query.studentId) { sql += ` AND student_id = $${paramIdx++}`; args.push(query.studentId); }
        if (query.status) { sql += ` AND status = $${paramIdx++}`; args.push(query.status); }
        if (query.category) { sql += ` AND category = $${paramIdx++}`; args.push(query.category); }
        if (query.level) { sql += ` AND level = $${paramIdx++}`; args.push(query.level); }

        const res = await db.query(sql, args);
        return Number(res.rows[0].cnt);
    },

    /** FIND BY ID AND UPDATE */
    findByIdAndUpdate: async (id, updates, options = {}) => {
        const db = getDb();
        const colMap = {
            title: 'title', category: 'category', description: 'description',
            level: 'level', date: 'date', institution: 'institution',
            certificateUrl: 'certificate_url', proofFiles: 'proof_files',
            status: 'status', remarks: 'remarks', verifiedBy: 'verified_by',
            verifiedAt: 'verified_at', isPublic: 'is_public', tags: 'tags',
            points: 'points',
        };

        const setParts = [];
        const args = [];
        let paramIdx = 1;

        for (const [key, val] of Object.entries(updates)) {
            const col = colMap[key];
            if (!col) continue;
            setParts.push(`${col} = $${paramIdx++}`);
            if (col === 'is_public') args.push(val ? 1 : 0);
            else if (col === 'proof_files' || col === 'tags') args.push(JSON.stringify(val));
            else if (col === 'date' || col === 'verified_at') args.push(val ? new Date(val).toISOString() : null);
            else args.push(val ?? null);
        }

        if (setParts.length) {
            if (updates.category || updates.level || updates.title || updates.description) {
                const current = await Achievement.findById(id);
                if (current) {
                    const newData = { ...current, ...updates };
                    const newPoints = calculatePoints(newData);
                    setParts.push(`points = $${paramIdx++}`);
                    args.push(newPoints);
                }
            }

            setParts.push(`updated_at = $${paramIdx++}`);
            args.push(new Date().toISOString());
            args.push(id);
            await db.query(`UPDATE achievements SET ${setParts.join(', ')} WHERE id = $${paramIdx}`, args);
        }

        if (options.new !== false) return Achievement.findById(id);
        return null;
    },

    /** AGGREGATE */
    aggregate: async (pipeline) => {
        const db = getDb();

        let matchStudentId = null;
        let matchStatus = null;

        for (const stage of pipeline) {
            if (stage.$match) {
                if (stage.$match.studentId) matchStudentId = stage.$match.studentId;
                if (stage.$match.status) matchStatus = stage.$match.status;
            }
        }

        const groupStage = pipeline.find(s => s.$group);
        if (!groupStage) return [];

        const groupId = groupStage.$group?._id;

        // GROUP BY category
        if (typeof groupId === 'string' && groupId === '$category') {
            let sql = `SELECT category AS _id, COUNT(*) as count`;
            const args = [];
            let paramIdx = 1;
            if (groupStage.$group?.approved) sql += `, SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END) as approved`;
            if (groupStage.$group?.points) sql += `, SUM(points) as points`;
            sql += ' FROM achievements WHERE 1=1';
            if (matchStatus) { sql += ` AND status=$${paramIdx++}`; args.push(matchStatus); }
            if (matchStudentId) { sql += ` AND student_id=$${paramIdx++}`; args.push(matchStudentId); }
            sql += ' GROUP BY category ORDER BY count DESC';
            const res = await db.query(sql, args);
            return res.rows.map(r => ({ _id: r._id, count: Number(r.count), approved: Number(r.approved || 0), points: Number(r.points || 0) }));
        }

        // GROUP BY level
        if (typeof groupId === 'string' && groupId === '$level') {
            let sql = `SELECT level AS _id, COUNT(*) as count FROM achievements WHERE 1=1`;
            const args = [];
            let paramIdx = 1;
            if (matchStatus) { sql += ` AND status=$${paramIdx++}`; args.push(matchStatus); }
            if (matchStudentId) { sql += ` AND student_id=$${paramIdx++}`; args.push(matchStudentId); }
            sql += ' GROUP BY level ORDER BY count DESC';
            const res = await db.query(sql, args);
            return res.rows.map(r => ({ _id: r._id, count: Number(r.count) }));
        }

        // SUM points (null group)
        if (groupId === null) {
            let sql = `SELECT SUM(points) as total FROM achievements WHERE 1=1`;
            const args = [];
            let paramIdx = 1;
            if (matchStatus) { sql += ` AND status=$${paramIdx++}`; args.push(matchStatus); }
            if (matchStudentId) { sql += ` AND student_id=$${paramIdx++}`; args.push(matchStudentId); }
            const res = await db.query(sql, args);
            return res.rows[0]?.total ? [{ _id: null, total: Number(res.rows[0].total) }] : [];
        }

        // GROUP BY student (top performers)
        if (typeof groupId === 'string' && groupId === '$studentId') {
            const limitStage = pipeline.find(s => s.$limit);
            const lim = limitStage?.$limit || 10;
            const res = await db.query(
                `SELECT
                    a.student_id AS _id,
                    SUM(a.points) AS totalpoints,
                    COUNT(*) AS achievementcount,
                    u.name AS student_name,
                    u.department AS student_department,
                    u.profile_image AS student_profile_image,
                    u.student_id AS student_student_id
                FROM achievements a
                LEFT JOIN users u ON a.student_id = u.id
                WHERE a.status = 'approved'
                GROUP BY a.student_id, u.name, u.department, u.profile_image, u.student_id
                ORDER BY totalpoints DESC
                LIMIT $1`,
                [lim]
            );
            return res.rows.map(r => ({
                _id: r._id,
                totalPoints: Number(r.totalpoints || 0),
                achievementCount: Number(r.achievementcount || 0),
                student: {
                    name: r.student_name,
                    department: r.student_department,
                    profileImage: r.student_profile_image || '',
                    studentId: r.student_student_id,
                },
            }));
        }

        // GROUP BY department
        if (typeof groupId === 'string' && groupId === '$student.department') {
            let sql = `
                SELECT u.department AS _id, COUNT(*) AS count,
                       SUM(CASE WHEN a.status='approved' THEN 1 ELSE 0 END) AS approved,
                       SUM(a.points) AS points
                FROM achievements a
                LEFT JOIN users u ON a.student_id = u.id
                WHERE 1=1`;
            const args = [];
            let paramIdx = 1;
            if (matchStatus) { sql += ` AND a.status=$${paramIdx++}`; args.push(matchStatus); }
            sql += ' GROUP BY u.department ORDER BY count DESC';
            const res = await db.query(sql, args);
            return res.rows.map(r => ({ _id: r._id, count: Number(r.count), approved: Number(r.approved || 0), points: Number(r.points || 0) }));
        }

        // Monthly trend
        if (groupId && typeof groupId === 'object' && groupId.year) {
            const hasSubmitted = !!groupStage.$group?.submitted;
            const res = await db.query(
                `SELECT
                    EXTRACT(YEAR FROM created_at::timestamp)::int AS year,
                    EXTRACT(MONTH FROM created_at::timestamp)::int AS month,
                    COUNT(*) AS ${hasSubmitted ? 'submitted' : 'count'},
                    SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END) AS approved
                FROM achievements
                GROUP BY EXTRACT(YEAR FROM created_at::timestamp), EXTRACT(MONTH FROM created_at::timestamp)
                ORDER BY year ASC, month ASC
                LIMIT 12`,
                []
            );
            return res.rows.map(r => ({
                _id: { year: Number(r.year), month: Number(r.month) },
                count: Number(r.count || r.submitted || 0),
                submitted: Number(r.submitted || r.count || 0),
                approved: Number(r.approved || 0),
            }));
        }

        return [];
    },
};

module.exports = Achievement;
