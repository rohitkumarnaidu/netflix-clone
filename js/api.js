/**
 * Netflix Clone API Service
 * Handles all communication with the backend API
 */

class NetflixAPI {
  constructor() {
    this.baseURL = window.APP_CONFIG ? window.APP_CONFIG.API_BASE_URL : 'http://localhost:5000/api';
    this.token = localStorage.getItem('netflix_token');
  }

  // Helper method to make API calls
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if token exists
    if (this.token) {
      defaultHeaders.Authorization = `Bearer ${this.token}`;
    }

    const config = {
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle token expiration
      if (response.status === 401 && data.message?.includes('token')) {
        this.handleTokenExpiration();
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Token management
  setToken(token) {
    this.token = token;
    localStorage.setItem('netflix_token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('netflix_token');
  }

  handleTokenExpiration() {
    this.removeToken();
    // Redirect to login or show login modal
    window.location.reload();
  }

  isLoggedIn() {
    return !!this.token;
  }

  // Auth endpoints
  async signup(userData) {
    const response = await this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async getProfile() {
    return await this.makeRequest('/auth/profile');
  }

  logout() {
    this.removeToken();
    window.location.reload();
  }

  // Movie endpoints
  async getTrendingMovies() {
    return await this.makeRequest('/movies/trending');
  }

  async getPopularMovies() {
    return await this.makeRequest('/movies/popular');
  }

  async getNewReleases() {
    return await this.makeRequest('/movies/new');
  }

  async getAllMovies(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/movies?${queryString}` : '/movies';
    return await this.makeRequest(endpoint);
  }

  async getMovieById(id) {
    return await this.makeRequest(`/movies/${id}`);
  }

  async searchMovies(query, filters = {}) {
    const params = { q: query, ...filters };
    const queryString = new URLSearchParams(params).toString();
    return await this.makeRequest(`/movies/search?${queryString}`);
  }

  // Watchlist endpoints (protected)
  async getWatchlist() {
    return await this.makeRequest('/watchlist');
  }

  async addToWatchlist(movieId) {
    return await this.makeRequest('/watchlist', {
      method: 'POST',
      body: JSON.stringify({ movieId }),
    });
  }

  async removeFromWatchlist(movieId) {
    return await this.makeRequest(`/watchlist/${movieId}`, {
      method: 'DELETE',
    });
  }

  async updateWatchlistItem(movieId, updates) {
    return await this.makeRequest(`/watchlist/${movieId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async getWatchlistStats() {
    return await this.makeRequest('/watchlist/stats');
  }

  async checkWatchlistStatus(movieId) {
    return await this.makeRequest(`/watchlist/status/${movieId}`);
  }
}

// Create a global instance
window.netflixAPI = new NetflixAPI();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NetflixAPI;
}
