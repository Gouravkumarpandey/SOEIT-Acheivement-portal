const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'University name is required'], unique: true, trim: true },
        slug: { type: String, required: [true, 'Slug is required'], unique: true, lowercase: true },
        logo: { type: String, default: '' },
        primaryColor: { type: String, default: '#3b82f6' }, // Default blue
        secondaryColor: { type: String, default: '#1e40af' },
        domain: { type: String }, // e.g., arkajainuniversity.ac.in
        settings: {
            allowPublicProfiles: { type: Boolean, default: true },
            requireVerification: { type: Boolean, default: true },
            leaderboardEnabled: { type: Boolean, default: true },
        },
        adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('University', universitySchema);
