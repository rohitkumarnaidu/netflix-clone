const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// Enable CORS for all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());
app.use(express.static(__dirname));

// Mock movie data with working poster URLs
const mockMovies = [
  {
    _id: "1",
    title: "Stranger Things",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.",
    releaseYear: 2016,
    genre: ["Drama", "Fantasy", "Horror"],
    rating: 8.7,
    poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    isTrending: true,
    isPopular: true,
    isNewRelease: false
  },
  {
    _id: "2",
    title: "The Witcher",
    description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
    releaseYear: 2019,
    genre: ["Action", "Adventure", "Drama"],
    rating: 8.2,
    poster_path: "/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
    isTrending: true,
    isPopular: true,
    isNewRelease: false
  },
  {
    _id: "3",
    title: "Wednesday",
    description: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends.",
    releaseYear: 2022,
    genre: ["Comedy", "Crime", "Fantasy"],
    rating: 8.1,
    poster_path: "/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    isTrending: true,
    isPopular: true,
    isNewRelease: true
  },
  {
    _id: "4",
    title: "Squid Game",
    description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games for a tempting prize.",
    releaseYear: 2021,
    genre: ["Action", "Drama", "Mystery"],
    rating: 8.0,
    poster_path: "/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
    isTrending: true,
    isPopular: true,
    isNewRelease: true
  },
  {
    _id: "5",
    title: "Money Heist",
    description: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
    releaseYear: 2017,
    genre: ["Crime", "Drama", "Mystery"],
    rating: 8.2,
    poster_path: "/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    isTrending: true,
    isPopular: true,
    isNewRelease: false
  },
  {
    _id: "6",
    title: "Dark",
    description: "A family saga with a supernatural twist, set in a German town, where the disappearance of two young children exposes the relationships among four families.",
    releaseYear: 2017,
    genre: ["Crime", "Drama", "Mystery"],
    rating: 8.8,
    poster_path: "/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg",
    isTrending: true,
    isPopular: true,
    isNewRelease: false
  },
  {
    _id: "7",
    title: "Breaking Bad",
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
    releaseYear: 2008,
    genre: ["Crime", "Drama", "Thriller"],
    rating: 9.5,
    poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    isTrending: true,
    isPopular: true,
    isNewRelease: false
  },
  {
    _id: "8",
    title: "House of Cards",
    description: "A Congressman works with his equally conniving wife to exact revenge on the people who betrayed him.",
    releaseYear: 2013,
    genre: ["Drama", "Thriller"],
    rating: 8.7,
    poster_path: "/hKWxWjFwnMvkWQawbhvC0Y7ygQ8.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/hKWxWjFwnMvkWQawbhvC0Y7ygQ8.jpg",
    isTrending: true,
    isPopular: true,
    isNewRelease: false
  },
  {
    _id: "9",
    title: "Bridgerton",
    description: "Wealth, lust, and betrayal set in the backdrop of Regency era England, seen through the eyes of the powerful Bridgerton family.",
    releaseYear: 2020,
    genre: ["Drama", "Romance"],
    rating: 7.3,
    poster_path: "/luoKpgVwi1E5nQsi7W0UuKHu2Rq.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/luoKpgVwi1E5nQsi7W0UuKHu2Rq.jpg",
    isTrending: true,
    isPopular: true,
    isNewRelease: true
  },
  {
    _id: "10",
    title: "The Umbrella Academy",
    description: "A dysfunctional family of superheroes comes together to solve the mystery of their father's death, the threat of the apocalypse and more.",
    releaseYear: 2019,
    genre: ["Action", "Adventure", "Comedy"],
    rating: 7.9,
    poster_path: "/scZlQQYnDVlnpxFTxaIv2g0BWnL.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/scZlQQYnDVlnpxFTxaIv2g0BWnL.jpg",
    isTrending: true,
    isPopular: true,
    isNewRelease: true
  },
  {
    _id: "11",
    title: "Narcos",
    description: "A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar, as well as the many other drug kingpins who plagued the country.",
    releaseYear: 2015,
    genre: ["Biography", "Crime", "Drama"],
    rating: 8.8,
    poster_path: "/rTmal9fDbwh5F0waol2hq35U4ah.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/rTmal9fDbwh5F0waol2hq35U4ah.jpg",
    isTrending: true,
    isPopular: true,
    isNewRelease: true
  },
  {
    _id: "12",
    title: "The Queen's Gambit",
    description: "Orphaned at the tender age of nine, prodigious introvert Beth Harmon discovers and masters the game of chess in 1960s USA.",
    releaseYear: 2020,
    genre: ["Drama"],
    rating: 8.5,
    poster_path: "/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg",
    isTrending: true,
    isPopular: true,
    isNewRelease: true
  }
];

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Netflix Clone API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/movies/trending', (req, res) => {
  console.log('📡 API Call: GET /api/movies/trending');
  const trendingMovies = mockMovies.filter(movie => movie.isTrending);
  res.json({
    success: true,
    count: trendingMovies.length,
    data: trendingMovies
  });
});

app.get('/api/movies/popular', (req, res) => {
  console.log('📡 API Call: GET /api/movies/popular');
  const popularMovies = mockMovies.filter(movie => movie.isPopular);
  res.json({
    success: true,
    count: popularMovies.length,
    data: popularMovies
  });
});

app.get('/api/movies/new', (req, res) => {
  console.log('📡 API Call: GET /api/movies/new');
  const newReleases = mockMovies.filter(movie => movie.isNewRelease);
  res.json({
    success: true,
    count: newReleases.length,
    data: newReleases
  });
});

app.get('/api/movies/search', (req, res) => {
  console.log('📡 API Call: GET /api/movies/search');
  const { q } = req.query;
  let results = mockMovies;
  
  if (q) {
    results = mockMovies.filter(movie => 
      movie.title.toLowerCase().includes(q.toLowerCase()) ||
      movie.description.toLowerCase().includes(q.toLowerCase())
    );
  }
  
  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

app.get('/api/movies/:id', (req, res) => {
  console.log('📡 API Call: GET /api/movies/' + req.params.id);
  const movie = mockMovies.find(m => m._id === req.params.id);
  
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
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all for frontend routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ 
      success: false, 
      message: 'API endpoint not found' 
    });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Netflix Clone Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🎬 Frontend available at http://localhost:${PORT}`);
  console.log(`✅ Mock data loaded with ${mockMovies.length} movies`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET /api/health');
  console.log('  GET /api/movies/trending');
  console.log('  GET /api/movies/popular');
  console.log('  GET /api/movies/new');
  console.log('  GET /api/movies/search?q=query');
  console.log('  GET /api/movies/:id');
});
