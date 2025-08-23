const express = require('express');
const router = express.Router();
const {
  getTrendingMovies,
  getPopularMovies,
  getNewReleases,
  getAllMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
  searchMovies,
  toggleTrending,
  togglePopular,
  getMovieStats
} = require('../controllers/movieController');
const { protect, admin } = require('../middleware/auth');
const { validateMovie, validateMovieQuery } = require('../middleware/validation');

// ✅ Trending Section API (First Feature from checklist)
router.get('/trending', getTrendingMovies);

// Get popular movies
router.get('/popular', getPopularMovies);

// Get new releases
router.get('/new', getNewReleases);

// Search movies
router.get('/search', validateMovieQuery, searchMovies);

// Get all movies with pagination and filters
router.get('/', validateMovieQuery, getAllMovies);

// Get movie by ID
router.get('/:id', getMovieById);

// Admin routes (protected)
router.post('/', protect, admin, validateMovie, addMovie);
router.put('/:id', protect, admin, validateMovie, updateMovie);
router.delete('/:id', protect, admin, deleteMovie);

// Admin management routes
router.patch('/:id/trending', protect, admin, toggleTrending);
router.patch('/:id/popular', protect, admin, togglePopular);
router.get('/stats/admin', protect, admin, getMovieStats);

module.exports = router;
