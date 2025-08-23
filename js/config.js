/**
 * Frontend Configuration
 * Handles environment-specific settings for the Netflix Clone frontend
 */

const CONFIG = {
  // API Configuration
  API_BASE_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : 'https://your-backend-domain.onrender.com/api',
  
  // Environment detection
  ENVIRONMENT: window.location.hostname === 'localhost' ? 'development' : 'production',
  
  // App Configuration
  APP_NAME: 'Netflix Clone',
  VERSION: '1.0.0',
  
  // Features
  FEATURES: {
    AUTHENTICATION: true,
    WATCHLIST: true,
    SEARCH: true,
    PAGINATION: true
  },
  
  // UI Configuration
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100
  },
  
  // Local Storage Keys
  STORAGE_KEYS: {
    TOKEN: 'netflix_token',
    USER: 'netflix_user',
    THEME: 'netflix_theme'
  }
};

// Make config globally available
window.APP_CONFIG = CONFIG;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
