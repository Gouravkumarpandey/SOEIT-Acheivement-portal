const Achievement = require('../models/Achievement');
const User = require('../models/User');
const Verification = require('../models/Verification');
const mongoose = require('mongoose');

// @desc    Admin dashboard stats
// @route   GET /api/admin/dashboard
exports.getDashboardStats = async (req, res, next) => {
    try {
        const [totalStudents, totalAchievements, pendingCount, approvedCount, rejectedCount] = await Promise.all([
            User.countDocuments({ role: 'student' }),
            Achievement.countDocuments(),
            Achievement.countDocuments({ status: 'pending' }),
            Achievement.countDocuments({ status: 'approved' }),
            Achievement.countDocuments({ status: 'rejected' }),
        ]);

        const byCategory = await Achievement.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 }, approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } } } },
            { $sort: { count: -1 } },
        ]);

        const byDepartment = await Achievement.aggregate([
            { $lookup: { from: 'users', localField: 'studentId', foreignField: '_id', as: 'student' } },
            { $unwind: '$student' },
            { $group: { _id: '$student.department', count: { $sum: 1 }, approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } } } },
            { $sort: { count: -1 } },
        ]);

        const monthlyTrend = await Achievement.aggregate([
            { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 12 },
        ]);

        const recentAchievements = await Achievement.find({ status: 'pending' })
            .populate('studentId', 'name department studentId profileImage')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            stats: { totalStudents, totalAchievements, pendingCount, approvedCount, rejectedCount },
            byCategory, byDepartment, monthlyTrend, recentAchievements,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all pending achievements for verification
// @route   GET /api/admin/achievements/pending
exports.getPendingAchievements = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, category, department, search } = req.query;
        let pipeline = [
            { $match: { status: 'pending' } },
            { $lookup: { from: 'users', localField: 'studentId', foreignField: '_id', as: 'student' } },
            { $unwind: '$student' },
        ];
        if (department) pipeline.push({ $match: { 'student.department': department } });
        if (category) pipeline.push({ $match: { category } });
        if (search) pipeline.push({ $match: { $or: [{ title: { $regex: search, $options: 'i' } }, { 'student.name': { $regex: search, $options: 'i' } }] } });

        const total = (await Achievement.aggregate([...pipeline, { $count: 'total' }]))[0]?.total || 0;
        pipeline.push({ $sort: { createdAt: -1 } }, { $skip: (page - 1) * limit }, { $limit: parseInt(limit) });

        const achievements = await Achievement.aggregate(pipeline);
        res.status(200).json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / limit), data: achievements });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify (approve/reject) achievement
// @route   PUT /api/admin/achievements/:id/verify
exports.verifyAchievement = async (req, res, next) => {
    try {
        const { action, remarks } = req.body;
        if (!['approved', 'rejected'].includes(action)) {
            return res.status(400).json({ success: false, message: 'Action must be approved or rejected' });
        }

        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) return res.status(404).json({ success: false, message: 'Achievement not found' });

        const previousStatus = achievement.status;
        achievement.status = action;
        achievement.remarks = remarks || '';
        achievement.verifiedBy = req.user.id;
        achievement.verifiedAt = new Date();
        await achievement.save();

        await Verification.create({ achievementId: achievement._id, verifiedBy: req.user.id, action, remarks, previousStatus, newStatus: action });

        await achievement.populate('studentId', 'name email department');
        await achievement.populate('verifiedBy', 'name role');

        res.status(200).json({ success: true, message: `Achievement ${action} successfully`, data: achievement });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all achievements (admin)
// @route   GET /api/admin/achievements
exports.getAllAchievements = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status, category, department, search } = req.query;
        let pipeline = [
            { $lookup: { from: 'users', localField: 'studentId', foreignField: '_id', as: 'student' } },
            { $unwind: '$student' },
        ];
        if (status) pipeline.push({ $match: { status } });
        if (department) pipeline.push({ $match: { 'student.department': department } });
        if (category) pipeline.push({ $match: { category } });
        if (search) pipeline.push({ $match: { $or: [{ title: { $regex: search, $options: 'i' } }, { 'student.name': { $regex: search, $options: 'i' } }] } });

        const total = (await Achievement.aggregate([...pipeline, { $count: 'total' }]))[0]?.total || 0;
        pipeline.push({ $sort: { createdAt: -1 } }, { $skip: (page - 1) * limit }, { $limit: parseInt(limit) });
        const achievements = await Achievement.aggregate(pipeline);
        res.status(200).json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / limit), data: achievements });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all students
// @route   GET /api/admin/students
exports.getStudents = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, department, search, batch, semester } = req.query;
        const query = { role: 'student', isActive: true };
        if (department) query.department = department;
        if (batch) query.batch = batch;
        if (semester) query.semester = parseInt(semester);
        if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { studentId: { $regex: search, $options: 'i' } }, { enrollmentNo: { $regex: search, $options: 'i' } }];

        const total = await User.countDocuments(query);
        const students = await User.find(query).select('-password').sort({ name: 1 }).skip((page - 1) * limit).limit(parseInt(limit));

        // Attach achievement counts
        const enriched = await Promise.all(students.map(async (student) => {
            const counts = {
                total: await Achievement.countDocuments({ studentId: student._id }),
                approved: await Achievement.countDocuments({ studentId: student._id, status: 'approved' }),
                pending: await Achievement.countDocuments({ studentId: student._id, status: 'pending' }),
                points: (await Achievement.aggregate([{ $match: { studentId: student._id, status: 'approved' } }, { $group: { _id: null, total: { $sum: '$points' } } }]))[0]?.total || 0,
            };
            return { ...student.toObject(), achievementCounts: counts };
        }));

        res.status(200).json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / limit), data: enriched });
    } catch (error) {
        next(error);
    }
};

// @desc    Get reports and analytics
// @route   GET /api/admin/reports
exports.getReports = async (req, res, next) => {
    try {
        const [categoryStats, levelStats, departmentStats, topPerformers, monthlyTrend] = await Promise.all([
            Achievement.aggregate([{ $match: { status: 'approved' } }, { $group: { _id: '$category', count: { $sum: 1 }, points: { $sum: '$points' } } }, { $sort: { count: -1 } }]),
            Achievement.aggregate([{ $match: { status: 'approved' } }, { $group: { _id: '$level', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
            Achievement.aggregate([
                { $match: { status: 'approved' } },
                { $lookup: { from: 'users', localField: 'studentId', foreignField: '_id', as: 'student' } },
                { $unwind: '$student' },
                { $group: { _id: '$student.department', count: { $sum: 1 }, points: { $sum: '$points' } } },
                { $sort: { count: -1 } },
            ]),
            Achievement.aggregate([
                { $match: { status: 'approved' } },
                { $group: { _id: '$studentId', totalPoints: { $sum: '$points' }, achievementCount: { $sum: 1 } } },
                { $sort: { totalPoints: -1 } },
                { $limit: 10 },
                { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'student' } },
                { $unwind: '$student' },
                { $project: { 'student.name': 1, 'student.department': 1, 'student.profileImage': 1, 'student.studentId': 1, totalPoints: 1, achievementCount: 1 } },
            ]),
            Achievement.aggregate([
                { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, submitted: { $sum: 1 }, approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } } } },
                { $sort: { '_id.year': 1, '_id.month': 1 } },
                { $limit: 12 },
            ]),
        ]);

        res.status(200).json({ success: true, categoryStats, levelStats, departmentStats, topPerformers, monthlyTrend });
    } catch (error) {
        next(error);
    }
};

// @desc    Manage users (activate/deactivate)
// @route   PUT /api/admin/users/:id
exports.manageUser = async (req, res, next) => {
    try {
        const { isActive, role } = req.body;
        const updates = {};
        if (isActive !== undefined) updates.isActive = isActive;
        if (role && req.user.role === 'admin') updates.role = role;

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, message: 'User updated successfully', user });
    } catch (error) {
        next(error);
    }
};
