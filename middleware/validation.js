const { body, query } = require('express-validator');

// User signup validation
const validateSignup = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Movie validation
const validateMovie = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('releaseYear')
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
    .withMessage('Release year must be a valid year'),
  body('genre')
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
  body('genre.*')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Genre names cannot be empty'),
  body('duration')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Duration is required'),
  body('posterUrl')
    .isURL()
    .withMessage('Poster URL must be a valid URL'),
  body('bannerUrl')
    .isURL()
    .withMessage('Banner URL must be a valid URL'),
  body('trailerUrl')
    .optional()
    .isURL()
    .withMessage('Trailer URL must be a valid URL'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10'),
  body('cast')
    .optional()
    .isArray()
    .withMessage('Cast must be an array'),
  body('cast.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Cast names cannot be empty'),
  body('director')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Director name must be between 1 and 100 characters'),
  body('language')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Language must be between 1 and 50 characters'),
  body('isTrending')
    .optional()
    .isBoolean()
    .withMessage('isTrending must be a boolean'),
  body('isPopular')
    .optional()
    .isBoolean()
    .withMessage('isPopular must be a boolean'),
  body('isNewRelease')
    .optional()
    .isBoolean()
    .withMessage('isNewRelease must be a boolean')
];

// Watchlist validation
const validateWatchlist = [
  body('movieId')
    .isMongoId()
    .withMessage('Invalid movie ID'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('watched')
    .optional()
    .isBoolean()
    .withMessage('Watched must be a boolean'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

// Movie query validation
const validateMovieQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('genre')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Genre must be a valid string'),
  query('search')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search query must be a valid string'),
  query('rating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10'),
  query('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
    .withMessage('Year must be a valid year'),
  query('sort')
    .optional()
    .isIn(['title', 'rating', 'releaseYear', 'createdAt'])
    .withMessage('Sort must be one of: title, rating, releaseYear, createdAt'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be either asc or desc')
];

module.exports = {
  validateSignup,
  validateLogin,
  validateMovie,
  validateWatchlist,
  validateMovieQuery
};
