require('dotenv').config({ path: './config.env' });

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const fallbackSecret = 'dev-only-secret-key-do-not-use-in-production';

if (isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-this-in-production')) {
  throw new Error('FATAL: JWT_SECRET environment variable is missing or insecure in production.');
}

module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: nodeEnv,
  
  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/netflix-clone',
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || fallbackSecret,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // API Configuration
  API_PREFIX: '/api',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
};
