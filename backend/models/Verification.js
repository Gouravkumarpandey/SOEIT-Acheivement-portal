const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema(
    {
        achievementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement', required: true },
        verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        action: { type: String, enum: ['approved', 'rejected', 'requested_info'], required: true },
        remarks: { type: String, maxlength: 500 },
        previousStatus: { type: String, enum: ['pending', 'approved', 'rejected'] },
        newStatus: { type: String, enum: ['pending', 'approved', 'rejected'] },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Verification', verificationSchema);
