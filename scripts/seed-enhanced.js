const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const User = require('../models/User');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });

const sampleMovies = [
  {
    title: "Stranger Things",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    releaseYear: 2016,
    genre: ["Drama", "Fantasy", "Horror"],
    duration: "45-150 min",
    rating: 8.7,
    posterUrl: "https://via.placeholder.com/200x300/e50914/ffffff?text=Stranger+Things",
    bannerUrl: "https://via.placeholder.com/500x300/e50914/ffffff?text=Stranger+Things+Banner",
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
    posterUrl: "https://via.placeholder.com/200x300/333333/ffffff?text=The+Witcher",
    bannerUrl: "https://via.placeholder.com/500x300/333333/ffffff?text=The+Witcher+Banner",
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
    posterUrl: "https://via.placeholder.com/200x300/1a1a1a/ffffff?text=Wednesday",
    bannerUrl: "https://via.placeholder.com/500x300/1a1a1a/ffffff?text=Wednesday+Banner",
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
    posterUrl: "https://via.placeholder.com/200x300/8B4513/ffffff?text=Bridgerton",
    bannerUrl: "https://via.placeholder.com/500x300/8B4513/ffffff?text=Bridgerton+Banner",
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
    posterUrl: "https://via.placeholder.com/200x300/DC143C/ffffff?text=Money+Heist",
    bannerUrl: "https://via.placeholder.com/500x300/DC143C/ffffff?text=Money+Heist+Banner",
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
    posterUrl: "https://via.placeholder.com/200x300/2F4F4F/ffffff?text=Dark",
    bannerUrl: "https://via.placeholder.com/500x300/2F4F4F/ffffff?text=Dark+Banner",
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
    posterUrl: "https://via.placeholder.com/200x300/FFD700/000000?text=The+Crown",
    bannerUrl: "https://via.placeholder.com/500x300/FFD700/000000?text=The+Crown+Banner",
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
    posterUrl: "https://via.placeholder.com/200x300/4682B4/ffffff?text=Ozark",
    bannerUrl: "https://via.placeholder.com/500x300/4682B4/ffffff?text=Ozark+Banner",
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
    posterUrl: "https://via.placeholder.com/200x300/8B0000/ffffff?text=Queen's+Gambit",
    bannerUrl: "https://via.placeholder.com/500x300/8B0000/ffffff?text=Queen's+Gambit+Banner",
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
    posterUrl: "https://via.placeholder.com/200x300/228B22/ffffff?text=Narcos",
    bannerUrl: "https://via.placeholder.com/500x300/228B22/ffffff?text=Narcos+Banner",
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
    posterUrl: "https://via.placeholder.com/200x300/800080/ffffff?text=Mindhunter",
    bannerUrl: "https://via.placeholder.com/500x300/800080/ffffff?text=Mindhunter+Banner",
    trailerUrl: "https://www.youtube.com/watch?v=EVGOwk8Z0FE",
    isTrending: false,
    isPopular: true,
    isNewRelease: false,
    cast: ["Jonathan Groff", "Holt McCallany", "Anna Torv"],
    director: "Joe Penhall",
    language: "English"
  },
  {
    title: "The Umbrella Academy",
    description: "On the same day in 1989, forty-three infants are inexplicably born to random, unconnected women who showed no signs of pregnancy the day before.",
    releaseYear: 2019,
    genre: ["Action", "Adventure", "Comedy"],
    duration: "60 min",
    rating: 8.0,
    posterUrl: "https://via.placeholder.com/200x300/FF6347/ffffff?text=Umbrella+Academy",
    bannerUrl: "https://via.placeholder.com/500x300/FF6347/ffffff?text=Umbrella+Academy+Banner",
    trailerUrl: "https://www.youtube.com/watch?v=ZQJAQoD4ZDM",
    isTrending: true,
    isPopular: true,
    isNewRelease: false,
    cast: ["Ellen Page", "Tom Hopper", "Emmy Raver-Lampman"],
    director: "Steve Blackman",
    language: "English"
  },
  {
    title: "Squid Game",
    description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games for a tempting prize, but the stakes are deadly.",
    releaseYear: 2021,
    genre: ["Action", "Drama", "Mystery"],
    duration: "60 min",
    rating: 8.0,
    posterUrl: "https://via.placeholder.com/200x300/FF1493/ffffff?text=Squid+Game",
    bannerUrl: "https://via.placeholder.com/500x300/FF1493/ffffff?text=Squid+Game+Banner",
    trailerUrl: "https://www.youtube.com/watch?v=oqxAJKy0ii4",
    isTrending: true,
    isPopular: true,
    isNewRelease: true,
    cast: ["Lee Jung-jae", "Park Hae-soo", "Wi Ha-joon"],
    director: "Hwang Dong-hyuk",
    language: "Korean"
  },
  {
    title: "Lupin",
    description: "Inspired by the adventures of Arsène Lupin, gentleman thief Assane Diop sets out to avenge his father for an injustice inflicted by a wealthy family.",
    releaseYear: 2021,
    genre: ["Action", "Crime", "Drama"],
    duration: "50 min",
    rating: 7.5,
    posterUrl: "https://via.placeholder.com/200x300/4B0082/ffffff?text=Lupin",
    bannerUrl: "https://via.placeholder.com/500x300/4B0082/ffffff?text=Lupin+Banner",
    trailerUrl: "https://www.youtube.com/watch?v=ga0iTWXCGa0",
    isTrending: false,
    isPopular: true,
    isNewRelease: true,
    cast: ["Omar Sy", "Ludivine Sagnier", "Clotilde Hesme"],
    director: "George Kay",
    language: "French"
  },
  {
    title: "Cobra Kai",
    description: "Decades after the tournament that changed their lives, the rivalry between Johnny and Daniel reignites in this sequel to the Karate Kid films.",
    releaseYear: 2018,
    genre: ["Action", "Comedy", "Drama"],
    duration: "30 min",
    rating: 8.5,
    posterUrl: "https://via.placeholder.com/200x300/FF4500/ffffff?text=Cobra+Kai",
    bannerUrl: "https://via.placeholder.com/500x300/FF4500/ffffff?text=Cobra+Kai+Banner",
    trailerUrl: "https://www.youtube.com/watch?v=xEt5dEOcW0I",
    isTrending: true,
    isPopular: true,
    isNewRelease: false,
    cast: ["Ralph Macchio", "William Zabka", "Courtney Henggeler"],
    director: "Josh Heald",
    language: "English"
  }
];

const seedDatabase = async () => {
  try {
    console.log('🔍 Starting database seeding process...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/netflix-clone';
    console.log('📡 Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Movie.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create sample users
    console.log('👥 Creating sample users...');
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
    console.log('✅ Sample users created');

    // Insert sample movies
    console.log('🎬 Inserting sample movies...');
    const insertedMovies = await Movie.insertMany(sampleMovies);
    console.log(`✅ ${insertedMovies.length} movies inserted successfully`);

    // Display statistics
    const stats = await Movie.aggregate([
      {
        $group: {
          _id: null,
          totalMovies: { $sum: 1 },
          trendingCount: { $sum: { $cond: ['$isTrending', 1, 0] } },
          popularCount: { $sum: { $cond: ['$isPopular', 1, 0] } },
          newReleaseCount: { $sum: { $cond: ['$isNewRelease', 1, 0] } },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    const movieStats = stats[0] || {
      totalMovies: 0,
      trendingCount: 0,
      popularCount: 0,
      newReleaseCount: 0,
      avgRating: 0
    };

    console.log('\n📊 Database Statistics:');
    console.log(`🎬 Total movies: ${movieStats.totalMovies}`);
    console.log(`🔥 Trending movies: ${movieStats.trendingCount}`);
    console.log(`⭐ Popular movies: ${movieStats.popularCount}`);
    console.log(`🆕 New releases: ${movieStats.newReleaseCount}`);
    console.log(`📈 Average rating: ${movieStats.avgRating.toFixed(1)}`);
    console.log(`👥 Total users: 2`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Sample Credentials:');
    console.log('👨‍💼 Admin: admin@netflixclone.com / admin123');
    console.log('👤 User: user@netflixclone.com / user123');
    
    console.log('\n🚀 You can now start your server and see movies loading!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

// Run the seeding function
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleMovies };
