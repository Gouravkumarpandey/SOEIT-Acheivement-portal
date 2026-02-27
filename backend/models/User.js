const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: [100, 'Name cannot exceed 100 characters'] },
        email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'] },
        password: { type: String, required: [true, 'Password is required'], minlength: [6, 'Password must be at least 6 characters'], select: false },
        role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
        department: { type: String, required: [true, 'Department is required'], enum: ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'Other'] },
        studentId: { type: String, sparse: true },
        phone: { type: String },
        bio: { type: String, maxlength: [500, 'Bio cannot exceed 500 characters'] },
        profileImage: { type: String, default: '' },
        batch: { type: String },
        semester: { type: Number, min: 1, max: 8 },
        section: { type: String },
        isActive: { type: Boolean, default: true },
        isVerified: { type: Boolean, default: false },
        linkedIn: { type: String, default: '' },
        github: { type: String, default: '' },
        portfolio: { type: String, default: '' },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        lastLogin: Date,
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};

module.exports = mongoose.model('User', userSchema);
