# 🎬 Netflix Clone Backend

A complete backend API for a Netflix clone built with Node.js, Express, and MongoDB.

## ✨ Features

### ✅ Completed Features
- **🔥 Trending Section API** - Fetch trending movies/shows
- **🎬 Movie Management** - CRUD operations for movies
- **🔐 Authentication** - User signup, login with JWT
- **❤️ Watchlist** - Add/remove movies to user's watchlist
- **🔎 Search** - Search movies with filters
- **🛡️ Route Protection** - Middleware for protected routes

### 🚀 Coming Soon
- User ratings and reviews
- Recommendation system
- Video streaming endpoints
- Social features

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Security**: bcryptjs for password hashing
- **CORS**: Enabled for frontend integration

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd netflix-clone
npm install
```

### 2. Environment Setup

Copy the config file and update with your values:

```bash
cp config.env.example config.env
```

Update `config.env`:
```env
MONGODB_URI=mongodb://localhost:27017/netflix-clone
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
NODE_ENV=development
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
# Start MongoDB service
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Cloud MongoDB (MongoDB Atlas):**
- Create account at [MongoDB Atlas](https://cloud.mongodb.com)
- Create cluster and get connection string
- Update `MONGODB_URI` in config.env

### 4. Seed Database (Optional)

```bash
npm run seed
```

### 5. Start Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will start at: `http://localhost:5000`

## 📚 API Endpoints

### 🔥 Trending Section (First Feature)
```
GET /api/movies/trending
```
Returns trending movies with `isTrending: true`

### 🎬 Movies
```
GET    /api/movies              # Get all movies with pagination
GET    /api/movies/:id          # Get movie by ID
POST   /api/movies              # Add new movie (admin only)
PUT    /api/movies/:id          # Update movie (admin only)
DELETE /api/movies/:id          # Delete movie (admin only)
```

### 🔎 Search
```
GET /api/movies/search?q=dark&genre=horror&year=2020&rating=8
```

### 🔐 Authentication
```
POST /api/auth/signup          # User registration
POST /api/auth/login           # User login
GET  /api/auth/profile         # Get user profile (protected)
PUT  /api/auth/profile         # Update profile (protected)
```

### ❤️ Watchlist
```
GET    /api/watchlist                    # Get user's watchlist (protected)
POST   /api/watchlist                    # Add movie to watchlist (protected)
DELETE /api/watchlist/:movieId           # Remove from watchlist (protected)
PUT    /api/watchlist/:movieId           # Update watchlist item (protected)
GET    /api/watchlist/status/:movieId    # Check watchlist status (protected)
```

## 🧪 Testing the API

### 1. Test Trending Endpoint
```bash
curl http://localhost:5000/api/movies/trending
```

### 2. Test Search
```bash
curl "http://localhost:5000/api/movies/search?q=stranger"
```

### 3. Test User Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
  }'
```

### 4. Test Protected Route
```bash
# First get token from login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Use token in Authorization header
curl http://localhost:5000/api/watchlist \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📁 Project Structure

```
netflix-clone/
├── models/                 # Database models
│   ├── Movie.js          # Movie schema
│   ├── User.js           # User schema
│   └── Watchlist.js      # Watchlist schema
├── controllers/           # Route controllers
│   ├── movieController.js
│   ├── authController.js
│   └── watchlistController.js
├── routes/               # API routes
│   ├── movies.js
│   ├── auth.js
│   └── watchlist.js
├── middleware/           # Custom middleware
│   ├── auth.js          # JWT authentication
│   └── validation.js    # Input validation
├── scripts/             # Utility scripts
│   └── seedMovies.js    # Database seeder
├── server.js            # Main server file
├── package.json         # Dependencies
├── config.env           # Environment variables
└── README.md            # This file
```

## 🔧 Configuration

### Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

### Database Schema
- **Movies**: title, description, genre, rating, poster/banner URLs, trending flags
- **Users**: email, password (hashed), username, admin status, watchlist
- **Watchlist**: user reference, movie reference, watched status, rating, notes

## 🚀 Deployment

This project is configured for easy deployment to cloud platforms.

### Quick Deploy
1. **Backend**: Deploy to Render using `render.yaml` configuration
2. **Frontend**: Deploy to Netlify/Vercel using provided config files
3. **Full Guide**: See `deployment.md` for complete step-by-step instructions

### Files Added for Deployment
- `render.yaml` - Render deployment configuration
- `netlify.toml` - Netlify deployment settings
- `vercel.json` - Vercel deployment configuration
- `.env.example` - Environment variables template
- `js/config.js` - Frontend environment configuration
- `deployment.md` - Complete deployment guide

### Local Production
```bash
NODE_ENV=production npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support, email [your-email] or create an issue in the repository.

---

**Happy Coding! 🎬✨**
