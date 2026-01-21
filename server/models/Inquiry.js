const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Let's make name required as requested to "collect contact name"
    },
    email: {
        type: String,
        // required: true, // Removed requirement to allow WhatsApp-only inquiries
    },
    arrivalDate: {
        type: Date,
    },
    isDateNotConfirmed: {
        type: Boolean,
        default: true,
    },
    travelers: {
        adults: { type: Number, default: 2 },
        children: { type: Number, default: 0 },
        toddlers: { type: Number, default: 0 },
    },
    note: {
        type: String,
    },
    connectOnWhatsapp: {
        type: Boolean,
        default: false,
    },
    whatsappNumber: {
        type: String,
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'booked', 'archived'],
        default: 'new',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Inquiry', inquirySchema);
