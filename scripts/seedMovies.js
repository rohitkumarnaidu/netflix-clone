const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: '../config.env' });

const sampleMovies = [
  {
    title: "Stranger Things",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    releaseYear: 2016,
    genre: ["Drama", "Fantasy", "Horror"],
    duration: "45-150 min",
    rating: 8.7,
    posterUrl: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaEv9u8Enq2qwYyf0.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=b9EkMc79ZSU",
    isTrending: true,
    isPopular: true,
    isNewRelease: false,
    cast: ["Millie Bobby Brown", "Finn Wolfhard", "Noah Schnapp"],
    director: "The Duffer Brothers",
    language: "English"
  },
  {
    title: "The Witcher",
    description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
    releaseYear: 2019,
    genre: ["Action", "Adventure", "Drama"],
    duration: "60 min",
    rating: 8.2,
    posterUrl: "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/jBJWaqoSCiARWtfVzGlfXKyHeFz.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=ndl1W4ltcmg",
    isTrending: true,
    isPopular: true,
    isNewRelease: false,
    cast: ["Henry Cavill", "Anya Chalotra", "Freya Allan"],
    director: "Lauren Schmidt Hissrich",
    language: "English"
  },
  {
    title: "Wednesday",
    description: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends at Nevermore Academy.",
    releaseYear: 2022,
    genre: ["Comedy", "Crime", "Fantasy"],
    duration: "45-60 min",
    rating: 8.1,
    posterUrl: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/9Gtg2DzBhmYamXBS1hKAhiwbB6I.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=Di310WS8zLk",
    isTrending: true,
    isPopular: true,
    isNewRelease: true,
    cast: ["Jenna Ortega", "Gwendoline Christie", "Riki Lindhome"],
    director: "Tim Burton",
    language: "English"
  },
  {
    title: "Bridgerton",
    description: "Wealth, lust, and betrayal set against the backdrop of Regency-era England, seen through the eyes of the powerful Bridgerton family.",
    releaseYear: 2020,
    genre: ["Drama", "Romance"],
    duration: "60 min",
    rating: 7.3,
    posterUrl: "https://image.tmdb.org/t/p/w500/qaewZ1HmeQKxKPSgjZjFVq5yL0e.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/6a1qbr1lpTHaCBxVJ6o1fcVk9Gf.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=gpv7ayf_tyE",
    isTrending: false,
    isPopular: true,
    isNewRelease: false,
    cast: ["Phoebe Dynevor", "Regé-Jean Page", "Jonathan Bailey"],
    director: "Chris Van Dusen",
    language: "English"
  },
  {
    title: "Money Heist",
    description: "Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.",
    releaseYear: 2017,
    genre: ["Action", "Crime", "Drama"],
    duration: "50 min",
    rating: 8.3,
    posterUrl: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/1J2lEz8jD0vnv6J1k5vZPq5hZfM.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=htqXL94R8cY",
    isTrending: false,
    isPopular: true,
    isNewRelease: false,
    cast: ["Úrsula Corberó", "Itziar Ituño", "Álvaro Morte"],
    director: "Álex Pina",
    language: "Spanish"
  },
  {
    title: "Dark",
    description: "A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.",
    releaseYear: 2017,
    genre: ["Crime", "Drama", "Mystery"],
    duration: "60 min",
    rating: 8.7,
    posterUrl: "https://image.tmdb.org/t/p/w500/7CB0eP6DD1UGc2c9jLAkqBmZPkq.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/7CB0eP6DD1UGc2c9jLAkqBmZPkq.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=ESEUoa-mz2c",
    isTrending: true,
    isPopular: false,
    isNewRelease: false,
    cast: ["Louis Hofmann", "Karoline Eichhorn", "Lisa Vicari"],
    director: "Baran bo Odar",
    language: "German"
  },
  {
    title: "The Crown",
    description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    releaseYear: 2016,
    genre: ["Biography", "Drama", "History"],
    duration: "60 min",
    rating: 8.7,
    posterUrl: "https://image.tmdb.org/t/p/w500/7k9y6JBE0dKjQz9tJ9XzNw6ZqGq.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/7k9y6JBE0dKjQz9tJ9XzNw6ZqGq.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=JWtnJjn6ng0",
    isTrending: false,
    isPopular: true,
    isNewRelease: false,
    cast: ["Olivia Colman", "Emma Corrin", "Josh O'Connor"],
    director: "Peter Morgan",
    language: "English"
  },
  {
    title: "Ozark",
    description: "A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a drug boss.",
    releaseYear: 2017,
    genre: ["Crime", "Drama", "Thriller"],
    duration: "60 min",
    rating: 8.5,
    posterUrl: "https://image.tmdb.org/t/p/w500/oy7Peo5iFgHmzCyxrACJhFEVZs.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/oy7Peo5iFgHmzCyxrACJhFEVZs.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=5hAXVqndjLY",
    isTrending: true,
    isPopular: true,
    isNewRelease: false,
    cast: ["Jason Bateman", "Laura Linney", "Julia Garner"],
    director: "Bill Dubuque",
    language: "English"
  },
  {
    title: "The Queen's Gambit",
    description: "Orphaned at the tender age of nine, prodigious introvert Beth Harmon discovers and masters the game of chess in 1960s USA.",
    releaseYear: 2020,
    genre: ["Drama"],
    duration: "60 min",
    rating: 8.6,
    posterUrl: "https://image.tmdb.org/t/p/w500/34OGjFEbHj0E3lE2w0iTUVq0CBz.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/34OGjFEbHj0E3lE2w0iTUVq0CBz.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=CDrieqwSdgQ",
    isTrending: true,
    isPopular: true,
    isNewRelease: true,
    cast: ["Anya Taylor-Joy", "Chloe Pirrie", "Bill Camp"],
    director: "Scott Frank",
    language: "English"
  },
  {
    title: "Narcos",
    description: "A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar, as well as the many other drug kingpins who plagued the country through the years.",
    releaseYear: 2015,
    genre: ["Biography", "Crime", "Drama"],
    duration: "50 min",
    rating: 8.8,
    posterUrl: "https://image.tmdb.org/t/p/w500/7k9y6JBE0dKjQz9tJ9XzNw6ZqGq.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/7k9y6JBE0dKjQz9tJ9XzNw6ZqGq.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=U7-clx26Gqc",
    isTrending: false,
    isPopular: true,
    isNewRelease: false,
    cast: ["Wagner Moura", "Boyd Holbrook", "Pedro Pascal"],
    director: "Carlo Bernard",
    language: "English"
  },
  {
    title: "Mindhunter",
    description: "In the late 1970s two FBI agents expand criminal science by delving into the psychology of murder and getting uneasily close to all-too-real monsters.",
    releaseYear: 2017,
    genre: ["Crime", "Drama", "Thriller"],
    duration: "60 min",
    rating: 8.6,
    posterUrl: "https://image.tmdb.org/t/p/w500/7k9y6JBE0dKjQz9tJ9XzNw6ZqGq.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/7k9y6JBE0dKjQz9tJ9XzNw6ZqGq.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=EVGOwk8Z0FE",
    isTrending: false,
    isPopular: true,
    isNewRelease: false,
    cast: ["Jonathan Groff", "Holt McCallany", "Anna Torv"],
    director: "Joe Penhall",
    language: "English"
  },
  {
    title: "The Haunting of Hill House",
    description: "Flashing between past and present, a fractured family confronts haunting memories of their old home and the terrifying events that drove them from it.",
    releaseYear: 2018,
    genre: ["Drama", "Horror", "Mystery"],
    duration: "60 min",
    rating: 8.5,
    posterUrl: "https://image.tmdb.org/t/p/w500/7k9y6JBE0dKjQz9tJ9XzNw6ZqGq.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/7k9y6JBE0dKjQz9tJ9XzNw6ZqGq.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=ZQJAQoD4ZDM",
    isTrending: true,
    isPopular: false,
    isNewRelease: false,
    cast: ["Michiel Huisman", "Elizabeth Reaser", "Oliver Jackson-Cohen"],
    director: "Mike Flanagan",
    language: "English"
  },
  {
    title: "Russian Doll",
    description: "A young woman gets caught in a mysterious loop where she dies at the end of the night, only to wake up at the same moment the next day.",
    releaseYear: 2019,
    genre: ["Comedy", "Drama", "Mystery"],
    duration: "30 min",
    rating: 7.8,
    posterUrl: "https://image.tmdb.org/t/p/w500/7k9y6JBE0dKjQz9tJ9XzNw6ZqGq.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/7k9y6JBE0dKjQz9tJ9XzNw6ZqGq.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=ZQJAQoD4ZDM",
    isTrending: false,
    isPopular: false,
    isNewRelease: true,
    cast: ["Natasha Lyonne", "Charlie Barnett", "Greta Lee"],
    director: "Leslye Headland",
    language: "English"
  },
  {
    title: "The Umbrella Academy",
    description: "On the same day in 1989, forty-three infants are inexplicably born to random, unconnected women who showed no signs of pregnancy the day before.",
    releaseYear: 2019,
    genre: ["Action", "Adventure", "Comedy"],
    duration: "60 min",
    rating: 8.0,
    posterUrl: "https://image.tmdb.org/t/p/w500/7k9y6JBE0dKjQz9tJ9XzNw6ZqGq.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/7k9y6JBE0dKjQz9tJ9XzNw6ZqGq.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=ZQJAQoD4ZDM",
    isTrending: true,
    isPopular: true,
    isNewRelease: false,
    cast: ["Ellen Page", "Tom Hopper", "Emmy Raver-Lampman"],
    director: "Steve Blackman",
    language: "English"
  },
  {
    title: "Sex Education",
    description: "A teenage boy with a sex therapist mother teams up with a high school classmate to set up an underground sex therapy clinic at school.",
    releaseYear: 2019,
    genre: ["Comedy", "Drama"],
    duration: "50 min",
    rating: 8.3,
    posterUrl: "https://image.tmdb.org/t/p/w500/7k9y6JBE0dKjQz9tJ9XzNw6ZqGq.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/7k9y6JBE0dKjQz9tJ9XzNw6ZqGq.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=ZQJAQoD4ZDM",
    isTrending: false,
    isPopular: true,
    isNewRelease: false,
    cast: ["Asa Butterfield", "Gillian Anderson", "Ncuti Gatwa"],
    director: "Laurie Nunn",
    language: "English"
  },
  {
    title: "The Good Place",
    description: "Four people and their otherworldly friar struggle in the afterlife to define what it means to be good.",
    releaseYear: 2016,
    genre: ["Comedy", "Drama", "Fantasy"],
    duration: "22 min",
    rating: 8.2,
    posterUrl: "https://image.tmdb.org/t/p/w500/7k9y6JBE0dKjQz9tJ9XzNw6ZqGq.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/original/7k9y6JBE0dKjQz9tJ9XzNw6ZqGq.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=ZQJAQoD4ZDM",
    isTrending: false,
    isPopular: false,
    isNewRelease: false,
    cast: ["Kristen Bell", "William Jackson Harper", "Jameela Jamil"],
    director: "Michael Schur",
    language: "English"
  }
];

const seedDatabase = async () => {
  try {
    // Debug: Log environment variables and paths
    console.log('🔍 Environment check:');
    console.log('Current working directory:', process.cwd());
    console.log('__dirname:', __dirname);
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Loaded' : '❌ Not loaded');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Loaded' : '❌ Not loaded');
    
    // Try different paths for config.env
    const configPath = path.join(__dirname, '..', 'config.env');
    console.log('Trying config path:', configPath);
    require('dotenv').config({ path: configPath });
    
    console.log('After reload - MONGODB_URI:', process.env.MONGODB_URI ? '✅ Loaded' : '❌ Not loaded');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/netflix-clone';
    console.log('📡 Connecting to:', mongoUri.substring(0, 50) + '...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Movie.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create sample users
    const adminUser = new User({
      email: 'admin@netflixclone.com',
      username: 'admin',
      password: 'admin123',
      isAdmin: true
    });

    const regularUser = new User({
      email: 'user@netflixclone.com',
      username: 'user',
      password: 'user123',
      isAdmin: false
    });

    await adminUser.save();
    await regularUser.save();
    console.log('👥 Created sample users (admin & regular)');

    // Insert sample movies
    const insertedMovies = await Movie.insertMany(sampleMovies);
    console.log(`✅ Inserted ${insertedMovies.length} movies`);

    // Display statistics
    const trendingCount = await Movie.countDocuments({ isTrending: true });
    const popularCount = await Movie.countDocuments({ isPopular: true });
    const newReleaseCount = await Movie.countDocuments({ isNewRelease: true });
    
    console.log(`🔥 Trending movies: ${trendingCount}`);
    console.log(`⭐ Popular movies: ${popularCount}`);
    console.log(`🆕 New releases: ${newReleaseCount}`);
    console.log(`👥 Total users: 2`);

    console.log('🎬 Database seeded successfully!');
    console.log('\n📋 Sample Credentials:');
    console.log('Admin: admin@netflixclone.com / admin123');
    console.log('User: user@netflixclone.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
