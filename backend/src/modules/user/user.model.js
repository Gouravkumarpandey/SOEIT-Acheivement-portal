const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { getDb } = require('../../config/db');

// nanoid - dynamic import helper
const genId = async () => {
    const { nanoid } = await import('nanoid');
    return nanoid();
};

const rowToUser = (row) => {
    if (!row) return null;
    return {
        _id: row.id,
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password,
        role: row.role,
        department: row.department,
        enrollmentNo: row.enrollment_no,
        studentId: row.student_id,
        phone: row.phone,
        bio: row.bio,
        profileImage: row.profile_image || '',
        batch: row.batch,
        semester: row.semester,
        section: row.section,
        isActive: row.is_active === 1 || row.is_active === true,
        isVerified: row.is_verified === 1 || row.is_verified === true,
        linkedIn: row.linked_in || '',
        github: row.github || '',
        portfolio: row.portfolio || '',
        edu10thSchool: row.edu_10th_school || '',
        edu10thYear: row.edu_10th_year || '',
        edu10thPercent: row.edu_10th_percent || '',
        edu12thSchool: row.edu_12th_school || '',
        edu12thYear: row.edu_12th_year || '',
        edu12thPercent: row.edu_12th_percent || '',
        universityName: row.university_name || 'Arka Jain University, Jamshedpur',
        universityCgpa: row.university_cgpa || '',
        skills: row.skills || '',
        resetPasswordToken: row.reset_password_token || undefined,
        resetPasswordExpire: row.reset_password_expire ? new Date(row.reset_password_expire) : undefined,
        lastLogin: row.last_login ? new Date(row.last_login) : undefined,
        createdAt: row.created_at ? new Date(row.created_at) : undefined,
        updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
        pushToken: row.push_token || '',

        matchPassword: async function (entered) {
            return bcrypt.compare(entered, this.password);
        },
        getResetPasswordToken: function () {
            const resetToken = crypto.randomBytes(20).toString('hex');
            this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
            return resetToken;
        },
        toObject: function () {
            const obj = { ...this };
            delete obj.matchPassword;
            delete obj.getResetPasswordToken;
            delete obj.save;
            delete obj.updateLastLogin;
            delete obj.toObject;
            return obj;
        },
        save: async function () {
            const db = getDb();
            await db.query(
                `UPDATE users SET
                    name=$1, email=$2, password=$3, role=$4, department=$5,
                    enrollment_no=$6, student_id=$7, phone=$8, bio=$9, profile_image=$10,
                    batch=$11, semester=$12, section=$13, is_active=$14, is_verified=$15,
                    linked_in=$16, github=$17, portfolio=$18,
                    edu_10th_school=$19, edu_10th_year=$20, edu_10th_percent=$21,
                    edu_12th_school=$22, edu_12th_year=$23, edu_12th_percent=$24,
                    university_name=$25, university_cgpa=$26, skills=$27,
                    reset_password_token=$28, reset_password_expire=$29, last_login=$30,
                    updated_at=$31, push_token=$32
                    WHERE id=$33`,
                [
                    this.name, this.email, this.password, this.role, this.department || null,
                    this.enrollmentNo || null, this.studentId || null,
                    this.phone || null, this.bio || null, this.profileImage || '',
                    this.batch || null, this.semester || null, this.section || null,
                    this.isActive ? 1 : 0, this.isVerified ? 1 : 0,
                    this.linkedIn || '', this.github || '', this.portfolio || '',
                    this.edu10thSchool || null, this.edu10thYear || null, this.edu10thPercent || null,
                    this.edu12thSchool || null, this.edu12thYear || null, this.edu12thPercent || null,
                    this.universityName || 'Arka Jain University, Jamshedpur', this.universityCgpa || null,
                    this.skills || null,
                    this.resetPasswordToken || null,
                    this.resetPasswordExpire ? this.resetPasswordExpire.toISOString() : null,
                    this.lastLogin ? this.lastLogin.toISOString() : null,
                    new Date().toISOString(),
                    this.pushToken || null,
                    this.id,
                ]
            );
        },
        updateLastLogin: async function () {
            const db = getDb();
            this.lastLogin = new Date();
            await db.query(
                `UPDATE users SET last_login=$1, updated_at=$2 WHERE id=$3`,
                [this.lastLogin.toISOString(), new Date().toISOString(), this.id]
            );
        },
    };
};

const User = {
    /** CREATE */
    create: async (data) => {
        const db = getDb();
        const id = await genId();

        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        await db.query(
            `INSERT INTO users
                (id, name, email, password, role, department, enrollment_no, student_id,
                 batch, semester, section, is_active, is_verified)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,1,0)`,
            [
                id, data.name, data.email.toLowerCase(), hashedPassword,
                data.role || 'student', data.department || null,
                data.enrollmentNo || null, data.studentId || null,
                data.batch || null, data.semester || null, data.section || null,
            ]
        );

        const result = await db.query('SELECT * FROM users WHERE id=$1', [id]);
        return rowToUser(result.rows[0]);
    },

    /** FIND ONE */
    findOne: async (query, selectFields = null) => {
        const db = getDb();
        let sql = `SELECT * FROM users WHERE 1=1`;
        const args = [];
        let paramIdx = 1;

        if (query.$or) {
            const orParts = [];
            for (const cond of query.$or) {
                if (cond.email !== undefined) {
                    orParts.push(`email = $${paramIdx++}`);
                    args.push(cond.email.toLowerCase());
                }
                if (cond.enrollmentNo !== undefined) {
                    orParts.push(`enrollment_no = $${paramIdx++}`);
                    args.push(cond.enrollmentNo);
                }
                if (cond.resetPasswordToken !== undefined) {
                    orParts.push(`reset_password_token = $${paramIdx++}`);
                    args.push(cond.resetPasswordToken);
                }
            }
            if (orParts.length) sql += ` AND (${orParts.join(' OR ')})`;
        } else {
            if (query.id !== undefined) { sql += ` AND id = $${paramIdx++}`; args.push(query.id); }
            if (query.email !== undefined) { sql += ` AND email = $${paramIdx++}`; args.push(query.email.toLowerCase ? query.email.toLowerCase() : query.email); }
            if (query.enrollmentNo !== undefined) { sql += ` AND enrollment_no = $${paramIdx++}`; args.push(query.enrollmentNo); }
            if (query.resetPasswordToken !== undefined) { sql += ` AND reset_password_token = $${paramIdx++}`; args.push(query.resetPasswordToken); }
            if (query.resetPasswordExpire?.$gt !== undefined) { sql += ` AND reset_password_expire > $${paramIdx++}`; args.push(new Date(query.resetPasswordExpire.$gt).toISOString()); }
        }

        sql += ' LIMIT 1';

        const result = await db.query(sql, args);
        return result.rows.length ? rowToUser(result.rows[0]) : null;
    },

    /** FIND BY ID */
    findById: async (id) => {
        const db = getDb();
        const result = await db.query('SELECT * FROM users WHERE id=$1', [id]);
        return result.rows.length ? rowToUser(result.rows[0]) : null;
    },

    /** FIND (multiple) with chainable select / sort / skip / limit */
    find: (query = {}) => {
        let _sort = null;
        let _skip = 0;
        let _limit = null;

        const buildAndExec = async () => {
            const db = getDb();
            let sql = 'SELECT * FROM users WHERE 1=1';
            const args = [];
            let paramIdx = 1;

            if (query.role) { sql += ` AND role = $${paramIdx++}`; args.push(query.role); }
            if (query.isActive !== undefined) { sql += ` AND is_active = $${paramIdx++}`; args.push(query.isActive ? 1 : 0); }
            if (query.department) { sql += ` AND department = $${paramIdx++}`; args.push(query.department); }
            if (query.batch) { sql += ` AND batch = $${paramIdx++}`; args.push(query.batch); }
            if (query.semester) { sql += ` AND semester = $${paramIdx++}`; args.push(query.semester); }
            if (query.section) { sql += ` AND section = $${paramIdx++}`; args.push(query.section); }
            if (query.$or) {
                const likes = [];
                for (const cond of query.$or) {
                    const key = Object.keys(cond)[0];
                    const colMap = { name: 'name', email: 'email', studentId: 'student_id', enrollmentNo: 'enrollment_no' };
                    const col = colMap[key];
                    if (col && cond[key]?.$regex) { likes.push(`${col} ILIKE $${paramIdx++}`); args.push(`%${cond[key].$regex}%`); }
                }
                if (likes.length) sql += ` AND (${likes.join(' OR ')})`;
            }

            if (_sort) {
                const [field, dir] = Object.entries(_sort)[0];
                const colMap = { name: 'name', createdAt: 'created_at' };
                sql += ` ORDER BY ${colMap[field] || field} ${dir === -1 || dir === 'desc' ? 'DESC' : 'ASC'}`;
            }
            if (_limit) sql += ` LIMIT ${_limit}`;
            if (_skip) sql += ` OFFSET ${_skip}`;

            const result = await db.query(sql, args);
            return result.rows.map(rowToUser);
        };

        const chain = {
            select: () => chain,
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
        let sql = 'SELECT COUNT(*) as cnt FROM users WHERE 1=1';
        const args = [];
        let paramIdx = 1;
        if (query.role) { sql += ` AND role = $${paramIdx++}`; args.push(query.role); }
        if (query.isActive !== undefined) { sql += ` AND is_active = $${paramIdx++}`; args.push(query.isActive ? 1 : 0); }
        if (query.department) { sql += ` AND department = $${paramIdx++}`; args.push(query.department); }
        if (query.batch) { sql += ` AND batch = $${paramIdx++}`; args.push(query.batch); }
        if (query.semester) { sql += ` AND semester = $${paramIdx++}`; args.push(query.semester); }
        if (query.section) { sql += ` AND section = $${paramIdx++}`; args.push(query.section); }
        if (query.$or) {
            const likes = [];
            for (const cond of query.$or) {
                const key = Object.keys(cond)[0];
                const colMap = { name: 'name', email: 'email', studentId: 'student_id', enrollmentNo: 'enrollment_no' };
                const col = colMap[key];
                if (col && cond[key]?.$regex) { likes.push(`${col} ILIKE $${paramIdx++}`); args.push(`%${cond[key].$regex}%`); }
            }
            if (likes.length) sql += ` AND (${likes.join(' OR ')})`;
        }
        const result = await db.query(sql, args);
        return Number(result.rows[0].cnt);
    },

    /** FIND BY ID AND UPDATE */
    findByIdAndUpdate: async (id, updates, options = {}) => {
        const db = getDb();
        const colMap = {
            name: 'name', phone: 'phone', bio: 'bio', batch: 'batch',
            semester: 'semester', section: 'section', linkedIn: 'linked_in',
            github: 'github', portfolio: 'portfolio', profileImage: 'profile_image',
            isActive: 'is_active', role: 'role',
            edu10thSchool: 'edu_10th_school', edu10thYear: 'edu_10th_year', edu10thPercent: 'edu_10th_percent',
            edu12thSchool: 'edu_12th_school', edu12thYear: 'edu_12th_year', edu12thPercent: 'edu_12th_percent',
            universityName: 'university_name', universityCgpa: 'university_cgpa',
            skills: 'skills', pushToken: 'push_token',
        };

        const setParts = [];
        const args = [];
        let paramIdx = 1;

        for (const [key, val] of Object.entries(updates)) {
            const col = colMap[key];
            if (col) {
                setParts.push(`${col} = $${paramIdx++}`);
                if (col === 'is_active') args.push(val ? 1 : 0);
                else args.push(val ?? null);
            }
        }
        if (!setParts.length) return User.findById(id);

        setParts.push(`updated_at = $${paramIdx++}`);
        args.push(new Date().toISOString());
        args.push(id);

        await db.query(`UPDATE users SET ${setParts.join(', ')} WHERE id = $${paramIdx}`, args);

        if (options.new) return User.findById(id);
        return null;
    },

    findByIdAndDelete: async (id) => {
        const db = getDb();
        const client = await db.connect();
        try {
            await client.query('BEGIN');
            await client.query(`DELETE FROM verifications WHERE verified_by = $1`, [id]);
            await client.query(`DELETE FROM verifications WHERE achievement_id IN (SELECT id FROM achievements WHERE student_id = $1)`, [id]);
            await client.query(`DELETE FROM achievements WHERE student_id = $1`, [id]);
            await client.query(`UPDATE achievements SET verified_by = NULL WHERE verified_by = $1`, [id]);
            await client.query(`DELETE FROM events WHERE created_by = $1`, [id]);
            await client.query(`DELETE FROM notices WHERE created_by = $1`, [id]);
            await client.query(`DELETE FROM courses WHERE student_id = $1`, [id]);
            await client.query(`DELETE FROM projects WHERE student_id = $1`, [id]);
            await client.query(`DELETE FROM internships WHERE student_id = $1`, [id]);
            await client.query(`DELETE FROM notifications WHERE user_id = $1`, [id]);
            await client.query(`DELETE FROM hackathons WHERE created_by = $1`, [id]);
            await client.query(`DELETE FROM internship_postings WHERE created_by = $1`, [id]);
            await client.query(`DELETE FROM course_assignments WHERE assigned_by = $1`, [id]);
            await client.query(`DELETE FROM hackathon_activities WHERE student_id = $1`, [id]);
            await client.query(`DELETE FROM badges WHERE student_id = $1`, [id]);
            await client.query(`DELETE FROM users WHERE id = $1`, [id]);
            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
        return true;
    },

    deleteMany: async (ids) => {
        const db = getDb();
        if (!ids || ids.length === 0) return true;
        const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
        const client = await db.connect();
        try {
            await client.query('BEGIN');
            await client.query(`DELETE FROM verifications WHERE verified_by IN (${placeholders})`, ids);
            await client.query(`DELETE FROM verifications WHERE achievement_id IN (SELECT id FROM achievements WHERE student_id IN (${placeholders}))`, ids);
            await client.query(`DELETE FROM achievements WHERE student_id IN (${placeholders})`, ids);
            await client.query(`UPDATE achievements SET verified_by = NULL WHERE verified_by IN (${placeholders})`, ids);
            await client.query(`DELETE FROM events WHERE created_by IN (${placeholders})`, ids);
            await client.query(`DELETE FROM notices WHERE created_by IN (${placeholders})`, ids);
            await client.query(`DELETE FROM courses WHERE student_id IN (${placeholders})`, ids);
            await client.query(`DELETE FROM projects WHERE student_id IN (${placeholders})`, ids);
            await client.query(`DELETE FROM internships WHERE student_id IN (${placeholders})`, ids);
            await client.query(`DELETE FROM notifications WHERE user_id IN (${placeholders})`, ids);
            await client.query(`DELETE FROM hackathons WHERE created_by IN (${placeholders})`, ids);
            await client.query(`DELETE FROM internship_postings WHERE created_by IN (${placeholders})`, ids);
            await client.query(`DELETE FROM course_assignments WHERE assigned_by IN (${placeholders})`, ids);
            await client.query(`DELETE FROM hackathon_activities WHERE student_id IN (${placeholders})`, ids);
            await client.query(`DELETE FROM badges WHERE student_id IN (${placeholders})`, ids);
            await client.query(`DELETE FROM users WHERE id IN (${placeholders})`, ids);
            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
        return true;
    },
};

module.exports = User;
