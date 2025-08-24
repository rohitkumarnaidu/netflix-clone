const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Enable CORS for all origins in development
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Mock movie data with real TMDB poster URLs
const mockMovies = [
  {
    _id: "1",
    title: "Stranger Things",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.",
    releaseYear: 2016,
    genre: ["Drama", "Fantasy", "Horror"],
    rating: 8.7,
    poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
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
    backdrop_path: "/1qpUk27LVI9UoTS7S0EixUBj5aR.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/w1280/1qpUk27LVI9UoTS7S0EixUBj5aR.jpg",
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
    backdrop_path: "/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/w1280/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg",
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
    backdrop_path: "/qw3J9cNeLioOLoR68WX7z79aCdK.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/w1280/qw3J9cNeLioOLoR68WX7z79aCdK.jpg",
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
    backdrop_path: "/xGexTKCJJVmKNGyGh4dVKAiQdmv.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/w1280/xGexTKCJJVmKNGyGh4dVKAiQdmv.jpg",
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
    backdrop_path: "/5LDBEwjJ84yjGLJyQk4fkBr6IG6.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/w1280/5LDBEwjJ84yjGLJyQk4fkBr6IG6.jpg",
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
    backdrop_path: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
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
    backdrop_path: "/mKBP1OCgCG0jw8DwVYlnYqKasq0.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/hKWxWjFwnMvkWQawbhvC0Y7ygQ8.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/w1280/mKBP1OCgCG0jw8DwVYlnYqKasq0.jpg",
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
    backdrop_path: "/sLbXneTErDvS3HIjqRWQJPiZ4Ci.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/luoKpgVwi1E5nQsi7W0UuKHu2Rq.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/w1280/sLbXneTErDvS3HIjqRWQJPiZ4Ci.jpg",
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
    backdrop_path: "/mE852dDd6zt2YxjqZhNq1xYDPrJ.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/scZlQQYnDVlnpxFTxaIv2g0BWnL.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/w1280/mE852dDd6zt2YxjqZhNq1xYDPrJ.jpg",
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
    backdrop_path: "/3qGeJlqGGomv6yR43qWBWaZeqNa.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/rTmal9fDbwh5F0waol2hq35U4ah.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/w1280/3qGeJlqGGomv6yR43qWBWaZeqNa.jpg",
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
    backdrop_path: "/34OGjFEbHKBq3aoXi4TB3aUkGQs.jpg",
    posterUrl: "https://image.tmdb.org/t/p/w500/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/w1280/34OGjFEbHKBq3aoXi4TB3aUkGQs.jpg",
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

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Test Netflix Clone Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🎬 Frontend available at http://localhost:${PORT}`);
  console.log(`✅ Mock data loaded with ${mockMovies.length} movies`);
});
