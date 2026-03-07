const Achievement = require('../models/Achievement');
const Verification = require('../models/Verification');
const User = require('../models/User');
const Course = require('../models/Course');
const HackathonActivity = require('../models/HackathonActivity');

// @desc    Create achievement
// @route   POST /api/achievements
exports.createAchievement = async (req, res, next) => {
    try {
        const { title, category, description, level, date, institution, tags, isPublic } = req.body;
        const proofFiles = [];

        if (req.files && req.files.length > 0) {
            req.files.forEach((file) => {
                proofFiles.push({
                    filename: file.filename,
                    originalname: file.originalname,
                    url: `/uploads/certificates/${file.filename}`,
                });
            });
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

        const student = await User.findById(req.params.userId);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        const achievements = await Achievement.find({
            studentId: req.params.userId,
            status: 'approved',
            isPublic: true,
        }).sort({ createdAt: -1 });

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

        const userQuery = { role: 'student', isActive: true };
        if (department) userQuery.department = department;

        let students = await User.find(userQuery)
            .select('-password -resetPasswordToken -resetPasswordExpire -email -phone')
            .sort({ name: 1 });

        // Filter by search name
        if (search) {
            const s = search.toLowerCase();
            students = students.filter(st =>
                st.name?.toLowerCase().includes(s) ||
                st.enrollmentNo?.toLowerCase().includes(s) ||
                st.department?.toLowerCase().includes(s)
            );
        }

        // Get achievement stats for each student in one query
        const studentIds = students.map(s => s._id?.toString() || s.id);
        const achievementAgg = await Achievement.find({
            studentId: { $in: studentIds },
            status: 'approved',
            isPublic: true,
        }).select('studentId points category');

        // Build stats map
        const statsMap = {};
        achievementAgg.forEach(a => {
            const sid = a.studentId;
            if (!statsMap[sid]) statsMap[sid] = { count: 0, points: 0, categories: new Set() };
            statsMap[sid].count += 1;
            statsMap[sid].points += a.points || 0;
            statsMap[sid].categories.add(a.category);
        });

        const result = students.map(s => {
            const sid = s._id?.toString() || s.id;
            const info = statsMap[sid] || { count: 0, points: 0, categories: new Set() };
            const plain = s.toObject ? s.toObject() : { ...s };
            return {
                ...plain,
                achievementCount: info.count,
                totalPoints: info.points,
                categoryCount: info.categories.size,
            };
        });

        // Sort: most achievements first
        result.sort((a, b) => b.achievementCount - a.achievementCount);

        res.status(200).json({ success: true, data: result, total: result.length });
    } catch (error) {
        next(error);
    }
};



// @desc    Get student stats
// @route   GET /api/achievements/stats
exports.getStudentStats = async (req, res, next) => {
    try {
        const studentId = req.user.id;

        const [all, approved, pending, rejected] = await Promise.all([
            Achievement.countDocuments({ studentId }),
            Achievement.countDocuments({ studentId, status: 'approved' }),
            Achievement.countDocuments({ studentId, status: 'pending' }),
            Achievement.countDocuments({ studentId, status: 'rejected' }),
        ]);

        const [byCategory, byLevel, totalPointsResult, recent] = await Promise.all([
            Achievement.aggregate([
                { $match: { studentId } },
                { $group: { _id: '$category', count: { $sum: 1 } } },
            ]),
            Achievement.aggregate([
                { $match: { studentId, status: 'approved' } },
                { $group: { _id: '$level', count: { $sum: 1 } } },
            ]),
            Achievement.aggregate([
                { $match: { studentId, status: 'approved' } },
                { $group: { _id: null, total: { $sum: '$points' } } },
            ]),
            Achievement.find({ studentId }).sort({ createdAt: -1 }).limit(5),
        ]);

        res.status(200).json({
            success: true,
            stats: {
                all, approved, pending, rejected,
                totalPoints: totalPointsResult[0]?.total || 0,
                byCategory,
                byLevel,
            },
            recentActivity: recent,
        });
    } catch (error) {
        next(error);
    }
};
