const express = require('express');
const router = express.Router();
const {
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlistItem,
  checkWatchlistStatus,
  getWatchlistStats,
  bulkAddToWatchlist
} = require('../controllers/watchlistController');
const { protect } = require('../middleware/auth');
const { validateWatchlist } = require('../middleware/validation');

// All watchlist routes are protected
router.use(protect);

// Get user's watchlist
router.get('/', getUserWatchlist);

// Add movie to watchlist
router.post('/', validateWatchlist, addToWatchlist);

// Remove movie from watchlist
router.delete('/:movieId', removeFromWatchlist);

// Update watchlist item
router.put('/:movieId', validateWatchlist, updateWatchlistItem);

// Check if movie is in watchlist
router.get('/status/:movieId', checkWatchlistStatus);

// Get watchlist statistics
router.get('/stats', getWatchlistStats);

// Bulk add movies to watchlist
router.post('/bulk', bulkAddToWatchlist);

module.exports = router;
