const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  watched: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  notes: String
});

// Ensure user can't add the same movie twice
watchlistSchema.index({ user: 1, movie: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
