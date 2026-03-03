const University = require('../models/University');

// @desc    Get all universities (Super Admin only)
// @route   GET /api/universities
exports.getUniversities = async (req, res, next) => {
    try {
        const universities = await University.find();
        res.status(200).json({ success: true, data: universities });
    } catch (error) {
        next(error);
    }
};

// @desc    Create university (Super Admin only)
// @route   POST /api/universities
exports.createUniversity = async (req, res, next) => {
    try {
        const { name, slug, domain, primaryColor, secondaryColor } = req.body;
        const university = await University.create({ name, slug, domain, primaryColor, secondaryColor });
        res.status(201).json({ success: true, data: university });
    } catch (error) {
        next(error);
    }
};

// @desc    Get university details (Includes settings)
// @route   GET /api/universities/:id
exports.getUniversity = async (req, res, next) => {
    try {
        const university = await University.findById(req.params.id);
        if (!university) return res.status(404).json({ success: false, message: 'University not found' });
        res.status(200).json({ success: true, data: university });
    } catch (error) {
        next(error);
    }
};

// @desc    Update university settings (Branding, Colors, Settings)
// @route   PUT /api/universities/:id
exports.updateUniversity = async (req, res, next) => {
    try {
        // Institutional admins can only update their own university
        if (req.user.role !== 'super-admin' && req.user.universityId.toString() !== req.params.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this university' });
        }

        const university = await University.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: 'University updated successfully', data: university });
    } catch (error) {
        next(error);
    }
};
