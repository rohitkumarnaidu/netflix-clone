const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const config = require('./config/config');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [config.CORS_ORIGIN, 'https://your-frontend-domain.netlify.app', 'https://your-frontend-domain.vercel.app']
    : config.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Connect to MongoDB
connectDB();

// Routes
app.use(`${config.API_PREFIX}/movies`, require('./routes/movies'));
app.use(`${config.API_PREFIX}/auth`, require('./routes/auth'));
app.use(`${config.API_PREFIX}/watchlist`, require('./routes/watchlist'));

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: config.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(config.PORT, () => {
  console.log(`🚀 Server running on port ${config.PORT}`);
  console.log(`🌍 Environment: ${config.NODE_ENV}`);
  console.log(`🌐 Frontend: http://localhost:${config.PORT}`);
  console.log(`🔌 API: http://localhost:${config.PORT}${config.API_PREFIX}`);
  console.log(`💚 Health Check: http://localhost:${config.PORT}/health`);
});
