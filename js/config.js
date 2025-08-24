/**
 * Frontend Configuration for Netflix Clone
 */

// Determine the environment and set API base URL
const getAPIBaseURL = () => {
  // Check if we're in development (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Try Node.js server first, fallback to different ports
    return 'http://localhost:5000/api';
  }
  
  // Production environment - replace with your actual backend URL
  return 'https://your-backend-domain.render.com/api';
};

// Global configuration object
window.APP_CONFIG = {
  API_BASE_URL: getAPIBaseURL(),
  
  // Other configuration options
  APP_NAME: 'Netflix Clone',
  VERSION: '1.0.0',
  
  // Feature flags
  FEATURES: {
    SEARCH_ENABLED: true,
    WATCHLIST_ENABLED: true,
    USER_PROFILES: true
  },
  
  // UI Configuration
  UI: {
    ITEMS_PER_PAGE: 20,
    CAROUSEL_ITEMS: 6,
    SEARCH_DEBOUNCE: 300
  }
};

// Test API connectivity and fallback if needed
const testAPIConnection = async () => {
  try {
    const response = await fetch(`${window.APP_CONFIG.API_BASE_URL}/health`, {
      method: 'GET',
      timeout: 5000
    });
    
    if (!response.ok) {
      throw new Error('API not responding');
    }
    
    console.log('✅ API connection successful');
    return true;
  } catch (error) {
    console.warn('⚠️ API connection failed, using fallback mode:', error.message);
    return false;
  }
};

// Initialize API connection test
testAPIConnection();

// Debug logging in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🔧 Netflix Clone Config:', window.APP_CONFIG);
  console.log('📡 API Base URL:', window.APP_CONFIG.API_BASE_URL);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.APP_CONFIG;
}
