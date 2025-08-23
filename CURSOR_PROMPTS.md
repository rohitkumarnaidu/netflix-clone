# 🚀 Cursor-Friendly Backend Prompts for Netflix Clone

Copy and paste these prompts **ONE BY ONE** into Cursor. Each prompt builds on the previous one.

---

## 📋 **PROMPT 1: Project Setup & Dependencies**

```
Create a Node.js + Express + MongoDB backend project for my Netflix clone with these requirements:

1. Initialize package.json with these dependencies:
   - express
   - mongoose
   - cors
   - dotenv
   - bcryptjs
   - jsonwebtoken
   - express-validator
   - nodemon (dev dependency)

2. Create this folder structure:
   - models/
   - controllers/
   - routes/
   - middleware/
   - config/
   - scripts/

3. Create a basic server.js file that:
   - Sets up Express server
   - Connects to MongoDB
   - Has basic error handling
   - Runs on port 5000

4. Create a .env file template with:
   - MONGODB_URI
   - JWT_SECRET
   - PORT
   - NODE_ENV

5. Add these npm scripts:
   - "start": "node server.js"
   - "dev": "nodemon server.js"
   - "seed": "node scripts/seedMovies.js"

Make sure everything is properly connected and the server can start without errors.
```

---

## 📋 **PROMPT 2: Database Models**

```
Create these MongoDB models using Mongoose for my Netflix clone:

1. **User Model** (`models/User.js`):
   - email (required, unique, validated)
   - username (required, unique, 3-30 chars)
   - password (required, min 6 chars, hashed with bcrypt)
   - profilePicture (optional URL)
   - isAdmin (boolean, default false)
   - watchlist (array of movie references)
   - createdAt, updatedAt timestamps
   - Pre-save hook to hash password
   - Method to compare passwords

2. **Movie Model** (`models/Movie.js`):
   - title (required, trimmed)
   - description (required)
   - releaseYear (required, number)
   - genre (array of strings, required)
   - duration (required string)
   - rating (number 0-10, default 0)
   - posterUrl (required URL)
   - bannerUrl (required URL)
   - trailerUrl (optional URL)
   - isTrending (boolean, default false)
   - isPopular (boolean, default false)
   - isNewRelease (boolean, default false)
   - cast (array of strings)
   - director (string)
   - language (string, default 'English')
   - createdAt, updatedAt timestamps
   - Pre-save hook to update timestamp

3. **Watchlist Model** (`models/Watchlist.js`):
   - user (required, ref to User)
   - movie (required, ref to Movie)
   - addedAt (timestamp, default now)
   - watched (boolean, default false)
   - rating (number 1-5, optional)
   - notes (string, optional)
   - Unique compound index on user + movie

Make sure all models have proper validation, indexes, and relationships.
```

---

## 📋 **PROMPT 3: Authentication System**

```
Create a complete JWT authentication system for my Netflix clone:

1. **Auth Controller** (`controllers/authController.js`):
   - `signup()`: Create new user, hash password with bcrypt, return JWT token
   - `login()`: Validate email/password, return JWT token
   - `getProfile()`: Get current user profile (protected route)
   - `updateProfile()`: Update user profile (protected route)
   - Use proper error handling and validation

2. **Auth Middleware** (`middleware/auth.js`):
   - `protect()`: Verify JWT token, add user to req.user
   - `admin()`: Check if user is admin (use after protect)
   - Handle token extraction from Authorization header
   - Proper error responses for invalid/expired tokens

3. **Auth Routes** (`routes/auth.js`):
   - POST `/api/auth/signup` (public)
   - POST `/api/auth/login` (public)
   - GET `/api/auth/profile` (protected)
   - PUT `/api/auth/profile` (protected)

4. **Validation Middleware** (`middleware/validation.js`):
   - `validateSignup`: Email, password, username validation
   - `validateLogin`: Email, password validation
   - Use express-validator with proper error messages

5. **JWT Configuration**:
   - Use dotenv for JWT_SECRET
   - 7-day token expiration
   - Secure token generation

Test all endpoints to ensure they work correctly.
```

---

## 📋 **PROMPT 4: Movie Management API**

```
Create a complete movie management API for my Netflix clone:

1. **Movie Controller** (`controllers/movieController.js`):
   - `getAllMovies()`: Get all movies with pagination, filtering, search
   - `getMovieById()`: Get single movie by ID
   - `getTrendingMovies()`: Get movies where isTrending = true
   - `getPopularMovies()`: Get movies where isPopular = true
   - `getNewReleases()`: Get movies where isNewRelease = true
   - `addMovie()`: Create new movie (admin only)
   - `updateMovie()`: Update movie by ID (admin only)
   - `deleteMovie()`: Delete movie by ID (admin only)
   - `searchMovies()`: Search movies by title/description

2. **Movie Routes** (`routes/movies.js`):
   - GET `/api/movies` (with query params for pagination/filtering)
   - GET `/api/movies/trending`
   - GET `/api/movies/popular`
   - GET `/api/movies/new`
   - GET `/api/movies/search`
   - GET `/api/movies/:id`
   - POST `/api/movies` (admin only)
   - PUT `/api/movies/:id` (admin only)
   - DELETE `/api/movies/:id` (admin only)

3. **Features**:
   - Pagination (page, limit)
   - Genre filtering
   - Search functionality
   - Admin-only CRUD operations
   - Proper error handling
   - Input validation

4. **Query Parameters**:
   - `?page=1&limit=20`
   - `?genre=action`
   - `?search=dark`
   - `?sort=rating&order=desc`

Test all endpoints and ensure proper authentication/authorization.
```

---

## 📋 **PROMPT 5: Watchlist System**

```
Create a complete watchlist system for my Netflix clone:

1. **Watchlist Controller** (`controllers/watchlistController.js`):
   - `getUserWatchlist()`: Get current user's watchlist (protected)
   - `addToWatchlist()`: Add movie to user's watchlist (protected)
   - `removeFromWatchlist()`: Remove movie from watchlist (protected)
   - `updateWatchlistItem()`: Update watched status, rating, notes (protected)
   - `getWatchlistStats()`: Get user's watchlist statistics (protected)

2. **Watchlist Routes** (`routes/watchlist.js`):
   - GET `/api/watchlist` (protected)
   - POST `/api/watchlist` (protected)
   - DELETE `/api/watchlist/:movieId` (protected)
   - PUT `/api/watchlist/:movieId` (protected)
   - GET `/api/watchlist/stats` (protected)

3. **Features**:
   - Prevent duplicate movies in watchlist
   - Track watched status
   - User ratings (1-5 stars)
   - Personal notes
   - Watchlist statistics
   - Proper error handling

4. **Data Structure**:
   - Movie reference with full movie details
   - User reference
   - Watched status
   - Rating and notes
   - Timestamps

5. **Validation**:
   - Ensure movie exists
   - Prevent duplicate entries
   - Validate rating range
   - Sanitize notes

Test all endpoints with authentication and ensure proper user isolation.
```

---

## 📋 **PROMPT 6: Database Seeding & Testing**

```
Create database seeding and testing scripts for my Netflix clone:

1. **Seed Script** (`scripts/seedMovies.js`):
   - Create sample movies with realistic data
   - Include trending, popular, and new release movies
   - Use proper movie genres and descriptions
   - Add sample users (admin and regular)
   - Handle duplicate prevention

2. **Sample Data**:
   - At least 20 movies across different genres
   - Mix of trending, popular, and new releases
   - Realistic movie titles and descriptions
   - Various ratings and release years
   - Sample poster and banner URLs

3. **Admin User Creation**:
   - Create admin user for testing
   - Create regular user for testing
   - Use secure passwords

4. **Testing Script** (`test-api.js`):
   - Test all API endpoints
   - Test authentication flows
   - Test protected routes
   - Test error handling
   - Generate test report

5. **Environment Setup**:
   - Ensure proper MongoDB connection
   - Handle seeding errors gracefully
   - Log seeding progress
   - Clean up test data option

Run the seed script and verify all data is properly created.
```

---

## 📋 **PROMPT 7: Error Handling & Validation**

```
Enhance error handling and validation for my Netflix clone:

1. **Global Error Handler** (`middleware/errorHandler.js`):
   - Centralized error handling middleware
   - Different error types (validation, auth, database, etc.)
   - Proper HTTP status codes
   - Development vs production error responses
   - Error logging

2. **Input Validation** (`middleware/validation.js`):
   - Enhanced validation for all models
   - Custom validation rules
   - Sanitization of inputs
   - Proper error messages
   - Validation for query parameters

3. **Request Validation**:
   - Validate all incoming requests
   - Check required fields
   - Validate data types and formats
   - Handle validation errors gracefully

4. **Security Enhancements**:
   - Rate limiting
   - CORS configuration
   - Helmet.js for security headers
   - Input sanitization
   - SQL injection prevention

5. **Error Responses**:
   - Consistent error format
   - Proper error codes
   - User-friendly messages
   - Detailed logging for debugging

Test error scenarios and ensure proper error handling throughout the API.
```

---

## 📋 **PROMPT 8: API Documentation & Testing**

```
Create comprehensive API documentation and testing for my Netflix clone:

1. **API Documentation** (`docs/API.md`):
   - Complete endpoint documentation
   - Request/response examples
   - Authentication requirements
   - Error codes and messages
   - Usage examples

2. **Postman Collection**:
   - Import/export collection
   - Environment variables
   - Test scripts
   - Automated testing

3. **API Testing**:
   - Unit tests for controllers
   - Integration tests for routes
   - Authentication tests
   - Error handling tests
   - Performance tests

4. **Health Check Endpoint**:
   - GET `/health` endpoint
   - Database connection status
   - API version information
   - System status

5. **Monitoring & Logging**:
   - Request logging
   - Error logging
   - Performance monitoring
   - API usage statistics

Ensure all endpoints are properly documented and tested.
```

---

## 📋 **PROMPT 9: Frontend Integration**

```
Integrate the backend API with the Netflix clone frontend:

1. **Frontend API Client**:
   - Create API service functions
   - Handle authentication tokens
   - Error handling for API calls
   - Loading states

2. **Authentication Integration**:
   - Login/signup forms
   - Token storage and management
   - Protected route handling
   - User profile management

3. **Movie Display**:
   - Fetch and display trending movies
   - Movie search functionality
   - Genre filtering
   - Pagination

4. **Watchlist Integration**:
   - Add/remove movies from watchlist
   - Display user's watchlist
   - Update watchlist items
   - Watchlist statistics

5. **Error Handling**:
   - User-friendly error messages
   - Loading indicators
   - Retry mechanisms
   - Offline handling

Test the complete user flow from frontend to backend.
```

---

## 📋 **PROMPT 10: Deployment & Production**

```
Prepare the Netflix clone backend for production deployment:

1. **Environment Configuration**:
   - Production environment variables
   - Secure JWT secrets
   - Database connection strings
   - CORS origins

2. **Security Hardening**:
   - Remove development dependencies
   - Secure headers
   - Rate limiting
   - Input validation

3. **Performance Optimization**:
   - Database indexing
   - Query optimization
   - Caching strategies
   - Compression

4. **Deployment Scripts**:
   - Build scripts
   - Environment setup
   - Database migration
   - Health checks

5. **Monitoring & Maintenance**:
   - Log aggregation
   - Error tracking
   - Performance monitoring
   - Backup strategies

Deploy to production and verify all functionality works correctly.
```

---

## 🎯 **How to Use These Prompts:**

1. **Copy ONE prompt** from above
2. **Paste it into Cursor**
3. **Let Cursor generate the code**
4. **Test the implementation**
5. **Move to the next prompt**
6. **Repeat until complete! ✅**

## 🚀 **Current Status:**

- ✅ **PROMPT 1-3**: Already implemented (Project setup, Models, Auth)
- 🔄 **PROMPT 4**: Partially implemented (Movie API)
- ⏳ **PROMPT 5-10**: Ready to implement

Start with **PROMPT 4** to complete your Movie Management API! 🎬
