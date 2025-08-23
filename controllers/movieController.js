const Movie = require('../models/Movie');

// ✅ Get trending movies (First Feature from checklist)
const getTrendingMovies = async (req, res) => {
  try {
    const trendingMovies = await Movie.find({ isTrending: true })
      .select('title description posterUrl bannerUrl rating genre releaseYear')
      .limit(20);
    
    res.json({
      success: true,
      count: trendingMovies.length,
      data: trendingMovies
    });
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trending movies'
    });
  }
};

// Get popular movies
const getPopularMovies = async (req, res) => {
  try {
    const popularMovies = await Movie.find({ isPopular: true })
      .select('title description posterUrl bannerUrl rating genre releaseYear')
      .sort({ rating: -1 })
      .limit(20);
    
    res.json({
      success: true,
      count: popularMovies.length,
      data: popularMovies
    });
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular movies'
    });
  }
};

// Get new releases
const getNewReleases = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const newReleases = await Movie.find({ 
      $or: [
        { isNewRelease: true },
        { releaseYear: currentYear }
      ]
    })
      .select('title description posterUrl bannerUrl rating genre releaseYear')
      .sort({ releaseYear: -1, createdAt: -1 })
      .limit(20);
    
    res.json({
      success: true,
      count: newReleases.length,
      data: newReleases
    });
  } catch (error) {
    console.error('Error fetching new releases:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching new releases'
    });
  }
};

// Get all movies with pagination, filtering, and sorting
const getAllMovies = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      genre, 
      search, 
      sort = 'createdAt', 
      order = 'desc',
      rating,
      year
    } = req.query;
    
    let query = {};
    
    // Filter by genre
    if (genre) {
      query.genre = { $in: [genre] };
    }
    
    // Filter by rating
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }
    
    // Filter by year
    if (year) {
      query.releaseYear = parseInt(year);
    }
    
    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;
    
    const movies = await Movie.find(query)
      .select('title description posterUrl bannerUrl rating genre releaseYear isTrending isPopular isNewRelease')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort(sortObj);
    
    const total = await Movie.countDocuments(query);
    
    res.json({
      success: true,
      data: movies,
      pagination: {
        totalPages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
        total,
        hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching movies'
    });
  }
};

// Get movie by ID
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching movie'
    });
  }
};

// Add new movie (admin only)
const addMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    
    res.status(201).json({
      success: true,
      message: 'Movie added successfully',
      data: movie
    });
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding movie',
      error: error.message
    });
  }
};

// Update movie (admin only)
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Movie updated successfully',
      data: movie
    });
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating movie'
    });
  }
};

// Delete movie (admin only)
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting movie'
    });
  }
};

// Toggle movie trending status (admin only)
const toggleTrending = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    movie.isTrending = !movie.isTrending;
    await movie.save();
    
    res.json({
      success: true,
      message: `Movie ${movie.isTrending ? 'added to' : 'removed from'} trending`,
      data: { isTrending: movie.isTrending }
    });
  } catch (error) {
    console.error('Error toggling trending status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating trending status'
    });
  }
};

// Toggle movie popular status (admin only)
const togglePopular = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    movie.isPopular = !movie.isPopular;
    await movie.save();
    
    res.json({
      success: true,
      message: `Movie ${movie.isPopular ? 'added to' : 'removed from'} popular`,
      data: { isPopular: movie.isPopular }
    });
  } catch (error) {
    console.error('Error toggling popular status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating popular status'
    });
  }
};

// Get movie statistics (admin only)
const getMovieStats = async (req, res) => {
  try {
    const stats = await Movie.aggregate([
      {
        $group: {
          _id: null,
          totalMovies: { $sum: 1 },
          totalTrending: { $sum: { $cond: ['$isTrending', 1, 0] } },
          totalPopular: { $sum: { $cond: ['$isPopular', 1, 0] } },
          totalNewReleases: { $sum: { $cond: ['$isNewRelease', 1, 0] } },
          avgRating: { $avg: '$rating' },
          totalGenres: { $addToSet: '$genre' }
        }
      },
      {
        $project: {
          _id: 0,
          totalMovies: 1,
          totalTrending: 1,
          totalPopular: 1,
          totalNewReleases: 1,
          avgRating: { $round: ['$avgRating', 2] },
          uniqueGenres: { $size: { $reduce: { input: '$totalGenres', initialValue: [], in: { $concatArrays: ['$$value', '$$this'] } } } }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: stats[0] || {
        totalMovies: 0,
        totalTrending: 0,
        totalPopular: 0,
        totalNewReleases: 0,
        avgRating: 0,
        uniqueGenres: 0
      }
    });
  } catch (error) {
    console.error('Error fetching movie stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching movie statistics'
    });
  }
};

// Advanced search movies with multiple filters
const searchMovies = async (req, res) => {
  try {
    const { 
      q, 
      genre, 
      year, 
      rating, 
      duration, 
      language,
      director,
      cast,
      page = 1,
      limit = 20,
      sort = 'rating',
      order = 'desc'
    } = req.query;
    
    let query = {};
    
    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { cast: { $regex: q, $options: 'i' } },
        { director: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Genre filter
    if (genre) {
      query.genre = { $in: [genre] };
    }
    
    // Year filter
    if (year) {
      query.releaseYear = parseInt(year);
    }
    
    // Rating filter
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }
    
    // Duration filter
    if (duration) {
      query.duration = { $regex: duration, $options: 'i' };
    }
    
    // Language filter
    if (language) {
      query.language = { $regex: language, $options: 'i' };
    }
    
    // Director filter
    if (director) {
      query.director = { $regex: director, $options: 'i' };
    }
    
    // Cast filter
    if (cast) {
      query.cast = { $regex: cast, $options: 'i' };
    }
    
    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;
    
    const movies = await Movie.find(query)
      .select('title description posterUrl bannerUrl rating genre releaseYear duration language director cast')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort(sortObj);
    
    const total = await Movie.countDocuments(query);
    
    res.json({
      success: true,
      count: movies.length,
      data: movies,
      pagination: {
        totalPages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
        total,
        hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching movies'
    });
  }
};

module.exports = {
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
};
