const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  releaseYear: {
    type: Number,
    required: true
  },
  genre: {
    type: [String],
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  posterUrl: {
    type: String,
    required: true
  },
  bannerUrl: {
    type: String,
    required: true
  },
  trailerUrl: {
    type: String
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isNewRelease: {
    type: Boolean,
    default: false
  },
  cast: [String],
  director: String,
  language: {
    type: String,
    default: 'English'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
movieSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Movie', movieSchema);
