const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let adminToken = '';

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

// Helper function to run tests
const runTest = async (testName, testFunction) => {
  testResults.total++;
  try {
    await testFunction();
    console.log(`✅ ${testName} - PASSED`);
    testResults.passed++;
  } catch (error) {
    console.log(`❌ ${testName} - FAILED: ${error.message}`);
    testResults.failed++;
  }
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...options.headers
    },
    ...options
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`${response.status}: ${data.message || 'Request failed'}`);
  }
  
  return { response, data };
};

// Test 1: Health Check
const testHealthCheck = async () => {
  const response = await fetch('http://localhost:5000/health');
  if (!response.ok) throw new Error('Health check failed');
  const data = await response.json();
  if (data.status !== 'OK') throw new Error('Health check status not OK');
};

// Test 2: User Signup
const testUserSignup = async () => {
  const { data } = await apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      email: `test${Date.now()}@example.com`,
      username: `testuser${Date.now()}`,
      password: 'testpass123'
    })
  });
  
  if (!data.data.token) throw new Error('No token received');
  authToken = data.data.token;
};

// Test 3: Admin Login
const testAdminLogin = async () => {
  const { data } = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@netflixclone.com',
      password: 'admin123'
    })
  });
  
  if (!data.data.token) throw new Error('No admin token received');
  adminToken = data.data.token;
};

// Test 4: Get Trending Movies
const testGetTrendingMovies = async () => {
  const { data } = await apiCall('/movies/trending');
  if (!data.success || !Array.isArray(data.data)) {
    throw new Error('Invalid trending movies response');
  }
  console.log(`   Found ${data.count} trending movies`);
};

// Test 5: Get Popular Movies
const testGetPopularMovies = async () => {
  const { data } = await apiCall('/movies/popular');
  if (!data.success || !Array.isArray(data.data)) {
    throw new Error('Invalid popular movies response');
  }
  console.log(`   Found ${data.count} popular movies`);
};

// Test 6: Get New Releases
const testGetNewReleases = async () => {
  const { data } = await apiCall('/movies/new');
  if (!data.success || !Array.isArray(data.data)) {
    throw new Error('Invalid new releases response');
  }
  console.log(`   Found ${data.count} new releases`);
};

// Test 7: Search Movies
const testSearchMovies = async () => {
  const { data } = await apiCall('/movies/search?q=dark');
  if (!data.success || !Array.isArray(data.data)) {
    throw new Error('Invalid search response');
  }
  console.log(`   Search found ${data.count} movies`);
};

// Test 8: Get All Movies with Pagination
const testGetAllMovies = async () => {
  const { data } = await apiCall('/movies?page=1&limit=5');
  if (!data.success || !Array.isArray(data.data)) {
    throw new Error('Invalid movies response');
  }
  console.log(`   Found ${data.data.length} movies (page 1)`);
};

// Test 9: Get Movie by ID
const testGetMovieById = async () => {
  // First get a movie ID from trending
  const { data: trendingData } = await apiCall('/movies/trending');
  if (trendingData.data.length === 0) {
    throw new Error('No trending movies to test with');
  }
  
  const movieId = trendingData.data[0]._id;
  const { data } = await apiCall(`/movies/${movieId}`);
  if (!data.success || !data.data) {
    throw new Error('Invalid movie by ID response');
  }
  console.log(`   Retrieved movie: ${data.data.title}`);
};

// Test 10: Add Movie to Watchlist
const testAddToWatchlist = async () => {
  // Get a movie ID
  const { data: trendingData } = await apiCall('/movies/trending');
  const movieId = trendingData.data[0]._id;
  
  const { data } = await apiCall('/watchlist', {
    method: 'POST',
    body: JSON.stringify({ movieId })
  });
  
  if (!data.success) throw new Error('Failed to add movie to watchlist');
  console.log(`   Added movie to watchlist`);
};

// Test 11: Get User Watchlist
const testGetWatchlist = async () => {
  const { data } = await apiCall('/watchlist');
  if (!data.success || !Array.isArray(data.data)) {
    throw new Error('Invalid watchlist response');
  }
  console.log(`   Watchlist has ${data.count} movies`);
};

// Test 12: Update Watchlist Item
const testUpdateWatchlist = async () => {
  // Get watchlist to find a movie ID
  const { data: watchlistData } = await apiCall('/watchlist');
  if (watchlistData.data.length === 0) {
    throw new Error('No movies in watchlist to update');
  }
  
  const movieId = watchlistData.data[0].movie._id;
  const { data } = await apiCall(`/watchlist/${movieId}`, {
    method: 'PUT',
    body: JSON.stringify({
      watched: true,
      rating: 5,
      notes: 'Great movie!'
    })
  });
  
  if (!data.success) throw new Error('Failed to update watchlist item');
  console.log(`   Updated watchlist item`);
};

// Test 13: Get Watchlist Stats
const testGetWatchlistStats = async () => {
  const { data } = await apiCall('/watchlist/stats');
  if (!data.success || !data.data) {
    throw new Error('Invalid watchlist stats response');
  }
  console.log(`   Watchlist stats: ${data.data.totalMovies} total, ${data.data.watchedMovies} watched`);
};

// Test 14: Admin Add Movie
const testAdminAddMovie = async () => {
  const { data } = await apiCall('/movies', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}` },
    body: JSON.stringify({
      title: 'Test Movie',
      description: 'A test movie for API testing',
      releaseYear: 2024,
      genre: ['Action', 'Adventure'],
      duration: '120 min',
      posterUrl: 'https://example.com/poster.jpg',
      bannerUrl: 'https://example.com/banner.jpg',
      rating: 8.5,
      isTrending: false,
      isPopular: false,
      isNewRelease: false
    })
  });
  
  if (!data.success) throw new Error('Failed to add movie as admin');
  console.log(`   Admin added movie: ${data.data.title}`);
};

// Test 15: Admin Get Movie Stats
const testAdminMovieStats = async () => {
  const { data } = await apiCall('/movies/stats/admin', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  
  if (!data.success || !data.data) {
    throw new Error('Failed to get admin movie stats');
  }
  console.log(`   Admin stats: ${data.data.totalMovies} total movies`);
};

// Test 16: Protected Route Access (should fail without token)
const testProtectedRouteAccess = async () => {
  // Store current token
  const currentToken = authToken;
  
  try {
    // Clear the auth token temporarily
    authToken = '';
    
    await apiCall('/watchlist');
    throw new Error('Protected route should require authentication');
  } catch (error) {
    if (error.message.includes('401')) {
      console.log(`   Protected route correctly requires authentication`);
      // Restore the token
      authToken = currentToken;
      return;
    }
    // Restore the token
    authToken = currentToken;
    throw error;
  }
};

// Test 17: Admin Route Access (should fail for regular user)
const testAdminRouteAccess = async () => {
  try {
    await apiCall('/movies/stats/admin');
    throw new Error('Admin route should require admin privileges');
  } catch (error) {
    if (error.message.includes('403')) {
      console.log(`   Admin route correctly requires admin privileges`);
      return;
    }
    throw error;
  }
};

// Main test runner
const runAllTests = async () => {
  console.log('🚀 Starting Netflix Clone API Tests...\n');
  
  try {
    // Basic functionality tests
    await runTest('Health Check', testHealthCheck);
    await runTest('User Signup', testUserSignup);
    await runTest('Admin Login', testAdminLogin);
    
    // Movie API tests
    await runTest('Get Trending Movies', testGetTrendingMovies);
    await runTest('Get Popular Movies', testGetPopularMovies);
    await runTest('Get New Releases', testGetNewReleases);
    await runTest('Search Movies', testSearchMovies);
    await runTest('Get All Movies with Pagination', testGetAllMovies);
    await runTest('Get Movie by ID', testGetMovieById);
    
    // Watchlist tests
    await runTest('Add Movie to Watchlist', testAddToWatchlist);
    await runTest('Get User Watchlist', testGetWatchlist);
    await runTest('Update Watchlist Item', testUpdateWatchlist);
    await runTest('Get Watchlist Stats', testGetWatchlistStats);
    
    // Admin tests
    await runTest('Admin Add Movie', testAdminAddMovie);
    await runTest('Admin Get Movie Stats', testAdminMovieStats);
    
    // Security tests
    await runTest('Protected Route Access', testProtectedRouteAccess);
    await runTest('Admin Route Access', testAdminRouteAccess);
    
  } catch (error) {
    console.error('❌ Test suite error:', error.message);
  }
  
  // Print results
  console.log('\n📊 Test Results:');
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed} ✅`);
  console.log(`Failed: ${testResults.failed} ❌`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  
  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! Your API is working perfectly!');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the implementation.');
  }
  
  process.exit(testResults.failed === 0 ? 0 : 1);
};

// Run tests
runAllTests();
