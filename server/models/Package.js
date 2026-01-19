const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: false // Optional for backward compatibility, or true if mandatory. User said "edit values later", so false is safer.
  },
  description: {
    type: String,
    required: true
  },

  images: {
    type: [String],
    default: []
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  videos: {
    type: [String],
    default: []
  },
  days: [{
    dayNumber: Number,
    title: String,
    description: String,
    coordinates: {
      lat: Number,
      lng: Number,
      name: String
    }
  }],
  stops: [{
    lat: Number,
    lng: Number,
    name: String,
    id: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Package', packageSchema);

