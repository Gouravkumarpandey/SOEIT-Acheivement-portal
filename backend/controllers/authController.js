const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '15m' });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_SECRET || 'refresh_secret_fallback', { expiresIn: '7d' });
};

const sendTokenResponse = async (user, statusCode, res, message = 'Success') => {
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user (optional but better for revocation)
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    delete userObj.refreshToken;

    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    res.status(statusCode)
        .cookie('refreshToken', refreshToken, options)
        .json({ success: true, message, token, user: userObj });
};

// @desc    Register student
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, department, studentId, enrollmentNo, batch, semester, section, universityId } = req.body;

        if (!universityId) {
            return res.status(400).json({ success: false, message: 'University ID is required' });
        }

        // Build duplicate-check query — only include enrollmentNo when provided
        const orConditions = [{ email: email?.toLowerCase() }];
        if (enrollmentNo && enrollmentNo.trim()) {
            orConditions.push({ enrollmentNo: enrollmentNo.trim() });
        }
        const existingUser = await User.findOne({ $or: orConditions });
        if (existingUser) return res.status(400).json({ success: false, message: 'Email or Enrollment No. already registered' });

        // Coerce semester to Number; schema requires Number (min 1 – max 8)
        const semesterNum = semester ? parseInt(semester, 10) : undefined;

        const user = await User.create({
            name,
            email,
            password,
            department,
            studentId: studentId?.trim() || undefined,
            enrollmentNo: enrollmentNo?.trim() || undefined,
            batch: batch?.trim() || undefined,
            semester: !isNaN(semesterNum) ? semesterNum : undefined,
            section: section?.trim() || undefined,
            universityId,
            role: 'student',
        });
        await sendTokenResponse(user, 201, res, 'Registration successful! Welcome to the Achievements Portal.');
    } catch (error) {
        console.error('[Register Error]', error.message, error.errors ?? '');
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body; // email field here acts as "Username" (email or enrollmentNo)
        if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide username and password' });

        // Find user by email OR enrollmentNo
        const user = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { enrollmentNo: email }
            ]
        }).select('+password');

        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        if (!user.isActive) return res.status(401).json({ success: false, message: 'Account is deactivated. Contact admin.' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });
        await sendTokenResponse(user, 200, res, 'Login successful');
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/profile
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
    try {
        const allowedFields = ['name', 'phone', 'bio', 'batch', 'semester', 'section', 'linkedIn', 'github', 'portfolio'];
        const updates = {};
        allowedFields.forEach((field) => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

        if (req.file) updates.profileImage = `/uploads/profiles/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: 'Profile updated successfully', user });
    } catch (error) {
        next(error);
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password');
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

        user.password = newPassword;
        await user.save();
        await sendTokenResponse(user, 200, res, 'Password changed successfully');
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ success: false, message: 'No user found with that email' });

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // In production, send email. For now, return token in response.
        res.status(200).json({
            success: true,
            message: 'Password reset token generated',
            resetToken, // Remove this in production - only send via email
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
exports.resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
        const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        await sendTokenResponse(user, 200, res, 'Password reset successful');
    } catch (error) {
        next(error);
    }
};

// @desc    Logout
// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
    if (req.user) {
        await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    }
    res.cookie('refreshToken', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Refresh Token
// @route   POST /api/auth/refresh
exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });

        const decoded = jwt.verify(token, process.env.REFRESH_SECRET || 'refresh_secret_fallback');
        const user = await User.findById(decoded.id).select('+refreshToken');

        if (!user || user.refreshToken !== token) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }

        const newToken = generateToken(user._id);
        res.status(200).json({ success: true, token: newToken });
    } catch (error) {
        next(error);
    }
};
