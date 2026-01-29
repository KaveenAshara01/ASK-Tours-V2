const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String, // Rich text HTML
        required: true
    },
    shortDescription: {
        type: String,
        trim: true
    },
    images: {
        type: [String],
        default: []
    },
    videos: {
        type: [String],
        default: []
    },
    // Date Handling
    dateType: {
        type: String,
        enum: ['single', 'range', 'recurring'],
        default: 'single'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    recurringPattern: {
        type: String, // e.g., "Every Weekend", "First Sunday"
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', eventSchema);
