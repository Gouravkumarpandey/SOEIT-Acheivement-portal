const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other']
    },
    date: {
        type: Date,
        required: [true, 'Event date is required']
    },
    venue: {
        type: String,
        required: [true, 'Venue is required']
    },
    registrationLink: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', eventSchema);
