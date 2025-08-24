const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const config = require('./config/config');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:8000',
      'http://127.0.0.1:8000',
      'http://localhost:5000',
      config.CORS_ORIGIN
    ];
    
    if (process.env.NODE_ENV === 'production') {
      allowedOrigins.push(
        'https://your-frontend-domain.netlify.app',
        'https://your-frontend-domain.vercel.app'
      );
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Connect to MongoDB with better error handling
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  // Don't exit, continue with placeholder data
});

// API Routes
app.use(`${config.API_PREFIX}/movies`, require('./routes/movies'));
app.use(`${config.API_PREFIX}/auth`, require('./routes/auth'));
app.use(`${config.API_PREFIX}/watchlist`, require('./routes/watchlist'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Netflix Clone API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all handler for frontend routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ 
      success: false, 
      message: 'API endpoint not found' 
    });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = config.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Netflix Clone Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🎬 Frontend available at http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});
