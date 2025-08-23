const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Temporary in-memory data (replaces MongoDB for now)
const tempMovies = [
  {
    _id: '1',
    title: "Stranger Things",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    releaseYear: 2016,
    genre: ["Drama", "Fantasy", "Horror"],
    duration: "45-150 min",
    rating: 8.7,
    posterUrl: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaEv9u8Enq2qwYyf0.jpg",
    isTrending: true,
    isPopular: true,
    isNew: false
  },
  {
    _id: '2',
    title: "The Witcher",
    description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
    releaseYear: 2019,
    genre: ["Action", "Adventure", "Drama"],
    duration: "60 min",
    rating: 8.2,
    posterUrl: "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/jBJWaqoSCiARWtfVzGlfXKyHeFz.jpg",
    isTrending: true,
    isPopular: true,
    isNew: false
  },
  {
    _id: '3',
    title: "Wednesday",
    description: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends at Nevermore Academy.",
    releaseYear: 2022,
    genre: ["Comedy", "Crime", "Fantasy"],
    duration: "45-60 min",
    rating: 8.1,
    posterUrl: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/9Gtg2DzBhmYamXBS1hKAhiwbB6I.jpg",
    isTrending: true,
    isPopular: true,
    isNew: true
  }
];

// Temporary in-memory users
const tempUsers = [];

// Routes
app.get('/api/movies/trending', (req, res) => {
  try {
    const trendingMovies = tempMovies.filter(movie => movie.isTrending);
    
    res.json({
      success: true,
      count: trendingMovies.length,
      data: trendingMovies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trending movies'
    });
  }
});

app.get('/api/movies', (req, res) => {
  try {
    const { page = 1, limit = 20, genre, search } = req.query;
    
    let filteredMovies = [...tempMovies];
    
    // Filter by genre
    if (genre) {
      filteredMovies = filteredMovies.filter(movie => 
        movie.genre.some(g => g.toLowerCase().includes(genre.toLowerCase()))
      );
    }
    
    // Search by title or description
    if (search) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.title.toLowerCase().includes(search.toLowerCase()) ||
        movie.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedMovies = filteredMovies.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedMovies,
      totalPages: Math.ceil(filteredMovies.length / limit),
      currentPage: parseInt(page),
      total: filteredMovies.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching movies'
    });
  }
});

app.get('/api/movies/search', (req, res) => {
  try {
    const { q, genre, year, rating } = req.query;
    
    let filteredMovies = [...tempMovies];
    
    if (q) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.title.toLowerCase().includes(q.toLowerCase()) ||
        movie.description.toLowerCase().includes(q.toLowerCase())
      );
    }
    
    if (genre) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.genre.some(g => g.toLowerCase().includes(genre.toLowerCase()))
      );
    }
    
    if (year) {
      filteredMovies = filteredMovies.filter(movie => movie.releaseYear === parseInt(year));
    }
    
    if (rating) {
      filteredMovies = filteredMovies.filter(movie => movie.rating >= parseFloat(rating));
    }
    
    res.json({
      success: true,
      count: filteredMovies.length,
      data: filteredMovies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching movies'
    });
  }
});

app.get('/api/movies/:id', (req, res) => {
  try {
    const movie = tempMovies.find(m => m._id === req.params.id);
    
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
    res.status(500).json({
      success: false,
      message: 'Error fetching movie'
    });
  }
});

// Simple auth endpoints (temporary)
app.post('/api/auth/signup', (req, res) => {
  try {
    const { email, password, username } = req.body;
    
    // Check if user exists
    const existingUser = tempUsers.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    // Create user (in real app, hash password)
    const newUser = {
      id: Date.now().toString(),
      email,
      username,
      isAdmin: false
    };
    
    tempUsers.push(newUser);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: newUser,
        token: 'temp-token-' + Date.now()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user'
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = tempUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token: 'temp-token-' + Date.now()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during login'
    });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Temporary Server running on port ${PORT}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
  console.log(`🔥 Test Trending: http://localhost:${PORT}/api/movies/trending`);
  console.log(`\n📝 This is a temporary server without MongoDB.`);
  console.log(`📝 Check MONGODB_SETUP.md for permanent setup options.`);
});

