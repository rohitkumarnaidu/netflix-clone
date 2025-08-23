const Watchlist = require('../models/Watchlist');
const Movie = require('../models/Movie');

// Get user's watchlist
const getUserWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ user: req.user.userId })
      .populate('movie', 'title description posterUrl bannerUrl rating genre releaseYear duration')
      .sort({ addedAt: -1 });

    res.json({
      success: true,
      count: watchlist.length,
      data: watchlist
    });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching watchlist'
    });
  }
};

// Add movie to watchlist
const addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Check if already in watchlist
    const existingItem = await Watchlist.findOne({
      user: req.user.userId,
      movie: movieId
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Movie already in watchlist'
      });
    }

    // Add to watchlist
    const watchlistItem = new Watchlist({
      user: req.user.userId,
      movie: movieId
    });

    await watchlistItem.save();

    // Populate movie details
    await watchlistItem.populate('movie', 'title description posterUrl bannerUrl rating genre releaseYear duration');

    res.status(201).json({
      success: true,
      message: 'Movie added to watchlist',
      data: watchlistItem
    });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to watchlist'
    });
  }
};

// Remove movie from watchlist
const removeFromWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;

    const watchlistItem = await Watchlist.findOneAndDelete({
      user: req.user.userId,
      movie: movieId
    });

    if (!watchlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found in watchlist'
      });
    }

    res.json({
      success: true,
      message: 'Movie removed from watchlist'
    });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from watchlist'
    });
  }
};

// Update watchlist item (mark as watched, add rating, notes)
const updateWatchlistItem = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { watched, rating, notes } = req.body;

    const watchlistItem = await Watchlist.findOneAndUpdate(
      {
        user: req.user.userId,
        movie: movieId
      },
      {
        watched,
        rating,
        notes
      },
      { new: true, runValidators: true }
    ).populate('movie', 'title description posterUrl bannerUrl rating genre releaseYear duration');

    if (!watchlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found in watchlist'
      });
    }

    res.json({
      success: true,
      message: 'Watchlist item updated',
      data: watchlistItem
    });
  } catch (error) {
    console.error('Error updating watchlist item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating watchlist item'
    });
  }
};

// Check if movie is in user's watchlist
const checkWatchlistStatus = async (req, res) => {
  try {
    const { movieId } = req.params;

    const watchlistItem = await Watchlist.findOne({
      user: req.user.userId,
      movie: movieId
    });

    res.json({
      success: true,
      data: {
        inWatchlist: !!watchlistItem,
        watched: watchlistItem ? watchlistItem.watched : false,
        rating: watchlistItem ? watchlistItem.rating : null,
        notes: watchlistItem ? watchlistItem.notes : null
      }
    });
  } catch (error) {
    console.error('Error checking watchlist status:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking watchlist status'
    });
  }
};

// Get user's watchlist statistics
const getWatchlistStats = async (req, res) => {
  try {
    const stats = await Watchlist.aggregate([
      {
        $match: { user: req.user.userId }
      },
      {
        $group: {
          _id: null,
          totalMovies: { $sum: 1 },
          watchedMovies: { $sum: { $cond: ['$watched', 1, 0] } },
          unwatchedMovies: { $sum: { $cond: ['$watched', 0, 1] } },
          avgRating: { $avg: '$rating' },
          totalRatings: { $sum: { $cond: [{ $ne: ['$rating', null] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          totalMovies: 1,
          watchedMovies: 1,
          unwatchedMovies: 1,
          avgRating: { $round: ['$avgRating', 2] },
          totalRatings: 1,
          watchProgress: {
            $round: [
              { $multiply: [{ $divide: ['$watchedMovies', '$totalMovies'] }, 100] },
              2
            ]
          }
        }
      }
    ]);

    // Get genre distribution
    const genreStats = await Watchlist.aggregate([
      {
        $match: { user: req.user.userId }
      },
      {
        $lookup: {
          from: 'movies',
          localField: 'movie',
          foreignField: '_id',
          as: 'movieData'
        }
      },
      {
        $unwind: '$movieData'
      },
      {
        $unwind: '$movieData.genre'
      },
      {
        $group: {
          _id: '$movieData.genre',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    const result = stats[0] || {
      totalMovies: 0,
      watchedMovies: 0,
      unwatchedMovies: 0,
      avgRating: 0,
      totalRatings: 0,
      watchProgress: 0
    };

    res.json({
      success: true,
      data: {
        ...result,
        topGenres: genreStats
      }
    });
  } catch (error) {
    console.error('Error fetching watchlist stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching watchlist statistics'
    });
  }
};

// Bulk add movies to watchlist
const bulkAddToWatchlist = async (req, res) => {
  try {
    const { movieIds } = req.body;

    if (!Array.isArray(movieIds) || movieIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Movie IDs array is required'
      });
    }

    // Check if movies exist
    const movies = await Movie.find({ _id: { $in: movieIds } });
    if (movies.length !== movieIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some movies not found'
      });
    }

    // Check for existing items
    const existingItems = await Watchlist.find({
      user: req.user.userId,
      movie: { $in: movieIds }
    });

    const existingMovieIds = existingItems.map(item => item.movie.toString());
    const newMovieIds = movieIds.filter(id => !existingMovieIds.includes(id));

    if (newMovieIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'All movies are already in watchlist'
      });
    }

    // Add new items
    const watchlistItems = newMovieIds.map(movieId => ({
      user: req.user.userId,
      movie: movieId
    }));

    await Watchlist.insertMany(watchlistItems);

    res.status(201).json({
      success: true,
      message: `${newMovieIds.length} movies added to watchlist`,
      data: {
        added: newMovieIds.length,
        alreadyExists: existingMovieIds.length
      }
    });
  } catch (error) {
    console.error('Error bulk adding to watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk adding to watchlist'
    });
  }
};

module.exports = {
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlistItem,
  checkWatchlistStatus,
  getWatchlistStats,
  bulkAddToWatchlist
};
