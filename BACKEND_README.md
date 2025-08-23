# Netflix Clone Backend API

A Node.js + Express + MongoDB backend for the Netflix Clone application.

## 🚀 Features

- **Authentication System** - JWT-based user authentication
- **Movie Management** - CRUD operations for movies
- **Watchlist System** - User watchlist management
- **RESTful API** - Clean and consistent API endpoints
- **MongoDB Integration** - Mongoose ODM with MongoDB
- **Input Validation** - Request validation middleware
- **Error Handling** - Comprehensive error handling
- **CORS Support** - Cross-origin resource sharing
- **Environment Configuration** - Secure environment variable management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Environment**: dotenv
- **Development**: nodemon

## 📁 Project Structure

```
netflix-clone/
├── config/                 # Configuration files
│   ├── config.js          # Environment variables and app config
│   └── database.js        # Database connection
├── controllers/            # Route controllers
│   ├── authController.js  # Authentication logic
│   ├── movieController.js # Movie management logic
│   ├── watchlistController.js # Watchlist logic
│   └── index.js           # Controller exports
├── middleware/             # Custom middleware
│   ├── auth.js            # JWT authentication
│   ├── validation.js      # Input validation
│   └── index.js           # Middleware exports
├── models/                 # Database models
│   ├── User.js            # User schema
│   ├── Movie.js           # Movie schema
│   ├── Watchlist.js       # Watchlist schema
│   └── index.js           # Model exports
├── routes/                 # API routes
│   ├── auth.js            # Authentication routes
│   ├── movies.js          # Movie routes
│   ├── watchlist.js       # Watchlist routes
│   └── index.js           # Route exports
├── scripts/                # Utility scripts
│   └── seedMovies.js      # Database seeding
├── config.env              # Environment variables
├── package.json            # Dependencies and scripts
├── server.js               # Main server file
└── BACKEND_README.md       # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd netflix-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `config.env.example` to `config.env`
   - Update the following variables:
     ```env
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=5000
     NODE_ENV=development
     ```

4. **Start the server**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/new` - Get new releases
- `POST /api/movies` - Create new movie (admin only)
- `PUT /api/movies/:id` - Update movie (admin only)
- `DELETE /api/movies/:id` - Delete movie (admin only)

### Watchlist
- `GET /api/watchlist` - Get user watchlist (protected)
- `POST /api/watchlist` - Add movie to watchlist (protected)
- `DELETE /api/watchlist/:movieId` - Remove movie from watchlist (protected)
- `PUT /api/watchlist/:movieId` - Update watchlist item (protected)

## 🗄️ Database Models

### User
- `email` - Unique email address
- `password` - Hashed password
- `username` - Unique username
- `profilePicture` - Profile image URL
- `isAdmin` - Admin privileges flag
- `watchlist` - Array of movie references

### Movie
- `title` - Movie title
- `description` - Movie description
- `releaseYear` - Year of release
- `genre` - Array of genres
- `duration` - Movie length
- `rating` - User rating (0-10)
- `posterUrl` - Poster image URL
- `bannerUrl` - Banner image URL
- `trailerUrl` - Trailer video URL
- `isTrending` - Trending flag
- `isPopular` - Popular flag
- `isNewRelease` - New release flag
- `cast` - Array of cast members
- `director` - Movie director
- `language` - Movie language

### Watchlist
- `user` - User reference
- `movie` - Movie reference
- `addedAt` - Addition timestamp
- `watched` - Watched status
- `rating` - User rating (1-5)
- `notes` - User notes

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login** - Get JWT token
2. **Protected Routes** - Include token in Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

## 🧪 Testing

Run the test script to verify API endpoints:
```bash
npm test
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/netflix-clone` |
| `JWT_SECRET` | JWT signing secret | `your-super-secret-jwt-key-change-this-in-production` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure production MongoDB
- [ ] Set up proper CORS origins
- [ ] Enable HTTPS
- [ ] Set up logging
- [ ] Configure rate limiting
- [ ] Set up monitoring

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error logs

---

**Happy Coding! 🎬🍿**
