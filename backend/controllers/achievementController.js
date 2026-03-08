const Achievement = require('../models/Achievement');
const Verification = require('../models/Verification');
const User = require('../models/User');
const Course = require('../models/Course');
const HackathonActivity = require('../models/HackathonActivity');
const FileModel = require('../models/File');

// @desc    Create achievement
// @route   POST /api/achievements
exports.createAchievement = async (req, res, next) => {
    try {
        const { title, category, description, level, date, institution, tags, isPublic } = req.body;
        const proofFiles = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                // Persistent Database Storage: Save buffer to 'files' table
                const fileId = await FileModel.upload(file.buffer, file.originalname, file.mimetype);

                proofFiles.push({
                    id: fileId,
                    filename: file.filename || file.originalname,
                    originalname: file.originalname,
                    url: `/api/achievements/files/${fileId}`,
                });
            }
        }

        const achievement = await Achievement.create({
            studentId: req.user.id,
            title, category, description, level, date, institution,
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            isPublic: isPublic !== undefined ? isPublic : true,
            proofFiles,
            certificateUrl: proofFiles.length > 0 ? proofFiles[0].url : '',
        });

        res.status(201).json({
            success: true,
            message: 'Achievement submitted successfully! Awaiting verification.',
            data: achievement,
        });
    } catch (error) {
        next(error);
    }
};

/** SERVE FILE FROM DATABASE */
exports.serveFile = async (req, res, next) => {
    try {
        const file = await FileModel.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ success: false, message: 'Record not found in database' });
        }

        res.set('Content-Type', file.mimetype);
        res.set('Content-Disposition', `inline; filename="${file.filename}"`);
        res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24h

        // Send buffer data from DB
        res.send(Buffer.from(file.data));
    } catch (error) {
        next(error);
    }
};

// @desc    Get my achievements
// @route   GET /api/achievements/my
exports.getMyAchievements = async (req, res, next) => {
    try {
        const { status, category, level, page = 1, limit = 10 } = req.query;

        const query = { studentId: req.user.id };
        if (status) query.status = status;
        if (category) query.category = category;
        if (level) query.level = level;

        const total = await Achievement.countDocuments(query);
        const achievements = await Achievement.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true, total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: achievements,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single achievement
// @route   GET /api/achievements/:id
exports.getAchievement = async (req, res, next) => {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) return res.status(404).json({ success: false, message: 'Achievement not found' });

        if (achievement.studentId !== req.user.id && !['admin', 'faculty'].includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.status(200).json({ success: true, data: achievement });
    } catch (error) {
        next(error);
    }
};

// @desc    Update achievement
// @route   PUT /api/achievements/:id
exports.updateAchievement = async (req, res, next) => {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) return res.status(404).json({ success: false, message: 'Achievement not found' });
        if (achievement.studentId !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
        if (achievement.status === 'approved') return res.status(400).json({ success: false, message: 'Cannot edit an approved achievement' });

        const { title, category, description, level, date, institution, tags, isPublic } = req.body;
        const updates = { title, category, description, level, date, institution, isPublic, status: 'pending' };
        if (tags) updates.tags = tags.split(',').map(t => t.trim());

        if (req.files && req.files.length > 0) {
            const newFiles = req.files.map((file) => ({
                filename: file.filename,
                originalname: file.originalname,
                url: `/uploads/certificates/${file.filename}`,
            }));
            updates.proofFiles = [...achievement.proofFiles, ...newFiles];
            if (!achievement.certificateUrl) updates.certificateUrl = newFiles[0].url;
        }

        const updated = await Achievement.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.status(200).json({ success: true, message: 'Achievement updated successfully', data: updated });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
exports.deleteAchievement = async (req, res, next) => {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) return res.status(404).json({ success: false, message: 'Achievement not found' });
        if (achievement.studentId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        await achievement.deleteOne();
        res.status(200).json({ success: true, message: 'Achievement deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get student public portfolio
// @route   GET /api/achievements/portfolio/:userId
exports.getPublicPortfolio = async (req, res, next) => {
    try {
        // Enforce student-to-student privacy: 
        // A student cannot see another student's portfolio.
        if (req.user && req.user.role === 'student' && req.user.id !== req.params.userId) {
            return res.status(403).json({
                success: false,
                message: 'Access Restricted: You can only view your own portfolio. One student is not authorized to audit another student\'s accomplishments.'
            });
        }

        // Parallelize fetching student data and achievements for speed
        const [student, achievements] = await Promise.all([
            User.findById(req.params.userId),
            Achievement.find({
                studentId: req.params.userId,
                status: 'approved',
                isPublic: true,
            }).sort({ createdAt: -1 })
        ]);

        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        const [coursesRows, hackathonsExplored] = await Promise.all([
            Course.findByStudentId(req.params.userId),
            HackathonActivity.countByStudent(req.params.userId)
        ]);

        const stats = {
            total: achievements.length,
            byCategory: {},
            byLevel: {},
            totalPoints: achievements.reduce((sum, a) => sum + (a.points || 0), 0),
            courses: coursesRows.length,
            completedCourses: coursesRows.filter(c => c.status === 'Completed').length,
            hackathonsExplored
        };
        achievements.forEach((a) => {
            stats.byCategory[a.category] = (stats.byCategory[a.category] || 0) + 1;
            stats.byLevel[a.level] = (stats.byLevel[a.level] || 0) + 1;
        });

        // Remove sensitive info from student object
        const studentData = student.toObject ? student.toObject() : { ...student };
        delete studentData.password;
        delete studentData.resetPasswordToken;
        delete studentData.resetPasswordExpire;

        res.status(200).json({ success: true, student: studentData, achievements, courses: coursesRows, stats });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all students for public directory
// @route   GET /api/achievements/public-students
exports.getPublicStudents = async (req, res, next) => {
    try {
        // Enforce student privacy: Students cannot browse the public student directory
        if (req.user && req.user.role === 'student') {
            return res.status(403).json({
                success: false,
                message: 'Access Restricted: Browsing the student registry is restricted to administrative and faculty accounts only. Use your direct link for sharing.'
            });
        }

        const { department, search } = req.query;
        const db = require('../config/db').getDb();

        // High-speed data fetching: JOIN aggregation for O(1) database roundtrip
        let sql = `
            SELECT 
                u.id, u.name, u.department, u.enrollment_no, u.student_id, u.profile_image, 
                u.batch, u.bio,
                COUNT(a.id) as achievementCount,
                SUM(COALESCE(a.points, 0)) as totalPoints,
                COUNT(DISTINCT a.category) as categoryCount
            FROM users u
            LEFT JOIN achievements a ON u.id = a.student_id AND a.status = 'approved' AND a.is_public = 1
            WHERE u.role = 'student' AND u.is_active = 1
        `;
        const args = [];

        if (department) {
            sql += ' AND u.department = ?';
            args.push(department);
        }

        if (search) {
            sql += ' AND (u.name LIKE ? OR u.enrollment_no LIKE ? OR u.student_id LIKE ?)';
            const sVal = `%${search}%`;
            args.push(sVal, sVal, sVal);
        }

        sql += ` GROUP BY u.id ORDER BY achievementCount DESC, u.name ASC`;

        const result = await db.execute({ sql, args });

        // Map back to expected format
        const finalData = result.rows.map(r => ({
            ...r,
            _id: r.id,
            achievementCount: Number(r.achievementCount || 0),
            totalPoints: Number(r.totalPoints || 0),
            categoryCount: Number(r.categoryCount || 0)
        }));

        res.status(200).json({ success: true, data: finalData, total: finalData.length });
    } catch (error) {
        next(error);
    }
};



// @desc    Get student stats
// @route   GET /api/achievements/stats
exports.getStudentStats = async (req, res, next) => {
    try {
        const studentId = req.user.id;
        const db = require('../config/db').getDb();

        // High Performance: Combine all count and points queries into ONE SQL execution
        const [quickStats, byCategory, byLevel, recent] = await Promise.all([
            db.execute({
                sql: `SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END) as approved,
                    SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status='rejected' THEN 1 ELSE 0 END) as rejected,
                    SUM(CASE WHEN status='approved' THEN points ELSE 0 END) as totalPoints
                  FROM achievements WHERE student_id = ?`,
                args: [studentId]
            }),
            Achievement.aggregate([
                { $match: { studentId } },
                { $group: { _id: '$category', count: { $sum: 1 } } },
            ]),
            Achievement.aggregate([
                { $match: { studentId, status: 'approved' } },
                { $group: { _id: '$level', count: { $sum: 1 } } },
            ]),
            Achievement.find({ studentId }).sort({ createdAt: -1 }).limit(5),
        ]);

        const statsRow = quickStats.rows[0] || {};

        res.status(200).json({
            success: true,
            stats: {
                all: Number(statsRow.total || 0),
                approved: Number(statsRow.approved || 0),
                pending: Number(statsRow.pending || 0),
                rejected: Number(statsRow.rejected || 0),
                totalPoints: Number(statsRow.totalPoints || 0),
                byCategory,
                byLevel,
            },
            recentActivity: recent,
        });
    } catch (error) {
        next(error);
    }
};
