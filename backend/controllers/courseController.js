const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Add a course (Student)
// @route   POST /api/courses
exports.addCourse = async (req, res, next) => {
    try {
        const { courseName, platform, status, progress, startDate } = req.body;
        const studentId = req.user.id;

        if (!courseName || !platform) {
            return res.status(400).json({ success: false, message: 'Course name and platform are required' });
        }

        const data = {
            studentId,
            courseName,
            platform,
            status: status || 'Ongoing',
            progress: progress || 0,
            startDate: startDate || new Date().toISOString(),
        };

        const course = await Course.create(data);
        res.status(201).json({ success: true, message: 'Ongoing course initialized in registry', data: course });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my courses (Student)
// @route   GET /api/courses/my
exports.getMyCourses = async (req, res, next) => {
    try {
        const courses = await Course.findByStudentId(req.user.id);
        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error) {
        next(error);
    }
};

// @desc    Update course progress (Student)
// @route   PUT /api/courses/:id/progress
exports.updateProgress = async (req, res, next) => {
    try {
        const { progress, status, completionDate } = req.body;
        const courseId = req.params.id;

        const course = await Course.findById(courseId);
        if (!course || course.student_id !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Synchronized record not found' });
        }

        const updatedCourse = await Course.updateProgress(courseId, progress, status, completionDate);
        res.status(200).json({ success: true, message: 'Analytical progress synchronized', data: updatedCourse });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete course (Student)
// @route   DELETE /api/courses/:id
exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course || course.student_id !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Record purged from local cache (Not found in registry)' });
        }

        await Course.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Analytical record purged from institutional registry' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all students' courses (Admin/Faculty)
// @route   GET /api/courses
exports.getAllCourses = async (req, res, next) => {
    try {
        const { department, status } = req.query;
        const courses = await Course.findAllEnriched({ department, status });

        // Transform row names back to JS names if needed (though the frontend can handle row keys too)
        const transformed = courses.map(c => ({
            id: c.id,
            courseName: c.course_name,
            platform: c.platform,
            status: c.status,
            progress: c.progress,
            studentName: c.student_name,
            department: c.department,
            enrollmentNo: c.enrollment_no,
            updatedAt: c.updated_at
        }));

        res.status(200).json({ success: true, count: transformed.length, data: transformed });
    } catch (error) {
        next(error);
    }
};
