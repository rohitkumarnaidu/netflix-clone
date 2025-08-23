/**
 * Netflix Clone Movie Manager
 * Handles movie data loading, display, and interactions
 */

class MovieManager {
  constructor() {
    this.cache = new Map();
    this.currentSearchQuery = '';
    this.currentFilters = {};
    this.init();
  }

  init() {
    this.loadInitialContent();
    this.bindEvents();
  }

  async loadInitialContent() {
    await this.loadTrendingMovies();
    await this.loadPopularMovies();
    await this.loadNewReleases();
  }

  async loadUserData() {
    // Load user-specific data when user logs in
    if (window.authManager && window.authManager.isLoggedIn()) {
      await window.watchlistManager.loadWatchlist();
    }
  }

  bindEvents() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const clearSearchButton = document.getElementById('clearSearch');

    if (searchInput) {
      // Search on Enter key
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleSearch();
        }
      });

      // Clear search on input clear
      searchInput.addEventListener('input', (e) => {
        if (e.target.value === '') {
          this.clearSearch();
        }
      });
    }

    if (searchButton) {
      searchButton.addEventListener('click', () => this.handleSearch());
    }

    if (clearSearchButton) {
      clearSearchButton.addEventListener('click', () => this.clearSearch());
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const genre = btn.dataset.genre;
        this.applyGenreFilter(genre);
      });
    });

    // Load more buttons
    const loadMoreButtons = document.querySelectorAll('.load-more-btn');
    loadMoreButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const section = btn.dataset.section;
        this.loadMoreMovies(section);
      });
    });
  }

  // Movie Loading Methods
  async loadTrendingMovies() {
    try {
      this.showLoading('trending-movies');
      const response = await netflixAPI.getTrendingMovies();
      
      if (response.success) {
        this.renderMovies(response.data, 'trending-movies', 'trending');
        this.cache.set('trending', response.data);
      }
    } catch (error) {
      console.error('Failed to load trending movies:', error);
      this.showError('trending-movies', 'Failed to load trending movies');
    }
  }

  async loadPopularMovies() {
    try {
      this.showLoading('popular-movies');
      const response = await netflixAPI.getPopularMovies();
      
      if (response.success) {
        this.renderMovies(response.data, 'popular-movies', 'popular');
        this.cache.set('popular', response.data);
      }
    } catch (error) {
      console.error('Failed to load popular movies:', error);
      this.showError('popular-movies', 'Failed to load popular movies');
    }
  }

  async loadNewReleases() {
    try {
      this.showLoading('new-releases');
      const response = await netflixAPI.getNewReleases();
      
      if (response.success) {
        this.renderMovies(response.data, 'new-releases', 'new');
        this.cache.set('new-releases', response.data);
      }
    } catch (error) {
      console.error('Failed to load new releases:', error);
      this.showError('new-releases', 'Failed to load new releases');
    }
  }

  async loadMoreMovies(section) {
    try {
      const button = document.querySelector(`[data-section="${section}"]`);
      button.textContent = 'Loading...';
      button.disabled = true;

      // Get current page from button data or default to 2
      const currentPage = parseInt(button.dataset.page || '2');
      
      let response;
      switch (section) {
        case 'trending':
          response = await netflixAPI.getAllMovies({ 
            page: currentPage, 
            limit: 10,
            isTrending: true 
          });
          break;
        case 'popular':
          response = await netflixAPI.getAllMovies({ 
            page: currentPage, 
            limit: 10,
            isPopular: true 
          });
          break;
        case 'new':
          response = await netflixAPI.getAllMovies({ 
            page: currentPage, 
            limit: 10,
            isNewRelease: true 
          });
          break;
        default:
          response = await netflixAPI.getAllMovies({ 
            page: currentPage, 
            limit: 10 
          });
      }

      if (response.success && response.data.length > 0) {
        this.appendMovies(response.data, `${section}-movies`);
        button.dataset.page = currentPage + 1;
        
        // Hide button if no more pages
        if (!response.pagination?.hasNext) {
          button.style.display = 'none';
        }
      } else {
        button.style.display = 'none';
      }

      button.textContent = 'Load More';
      button.disabled = false;
    } catch (error) {
      console.error('Failed to load more movies:', error);
      this.showNotification('Failed to load more movies', 'error');
    }
  }

  // Search and Filter Methods
  async handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();

    if (!query) return;

    this.currentSearchQuery = query;
    
    try {
      this.showLoading('search-results');
      this.showSearchResults();
      
      const response = await netflixAPI.searchMovies(query, this.currentFilters);
      
      if (response.success) {
        this.renderMovies(response.data, 'search-results', 'search');
        
        // Update UI
        document.getElementById('searchResultsTitle').textContent = 
          `Search Results for "${query}" (${response.count} found)`;
      }
    } catch (error) {
      console.error('Search failed:', error);
      this.showError('search-results', 'Search failed. Please try again.');
    }
  }

  clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResultsSection');
    
    searchInput.value = '';
    this.currentSearchQuery = '';
    this.currentFilters = {};
    
    if (searchResults) {
      searchResults.style.display = 'none';
    }

    // Show main sections again
    this.showMainSections();
  }

  async applyGenreFilter(genre) {
    this.currentFilters.genre = genre;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-genre="${genre}"]`).classList.add('active');

    // If there's a search query, research with filter
    if (this.currentSearchQuery) {
      await this.handleSearch();
    } else {
      // Load filtered movies
      try {
        this.showLoading('filtered-results');
        this.showFilteredResults(genre);
        
        const response = await netflixAPI.getAllMovies({ genre, limit: 20 });
        
        if (response.success) {
          this.renderMovies(response.data, 'filtered-results', 'filtered');
          document.getElementById('filteredResultsTitle').textContent = 
            `${genre} Movies (${response.pagination?.total || response.data.length} found)`;
        }
      } catch (error) {
        console.error('Filter failed:', error);
        this.showError('filtered-results', 'Failed to load filtered movies');
      }
    }
  }

  // Rendering Methods
  renderMovies(movies, containerId, type = 'default') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (movies.length === 0) {
      container.innerHTML = '<p class="no-movies">No movies found</p>';
      return;
    }

    movies.forEach((movie, index) => {
      const movieCard = this.createMovieCard(movie, index + 1, type);
      container.appendChild(movieCard);
    });
  }

  appendMovies(movies, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    movies.forEach((movie, index) => {
      const movieCard = this.createMovieCard(movie, container.children.length + index + 1);
      container.appendChild(movieCard);
    });
  }

  createMovieCard(movie, rank = null, type = 'default') {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    movieCard.dataset.movieId = movie._id;

    const posterUrl = movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image';
    const rating = movie.rating ? movie.rating.toFixed(1) : 'N/A';
    const genres = movie.genre ? movie.genre.slice(0, 2).join(', ') : 'Unknown';
    const year = movie.releaseYear || 'Unknown';

    movieCard.innerHTML = `
      <div class="movie-poster-wrapper">
        <img src="${posterUrl}" alt="${movie.title}" class="movie-poster" loading="lazy">
        <div class="movie-overlay">
          <div class="movie-actions">
            <button class="action-btn play-btn" data-movie-id="${movie._id}">
              <i class="fas fa-play"></i>
            </button>
            ${window.authManager && window.authManager.isLoggedIn() ? `
              <button class="action-btn watchlist-btn" data-movie-id="${movie._id}">
                <i class="fas fa-plus"></i>
              </button>
            ` : ''}
            <button class="action-btn info-btn" data-movie-id="${movie._id}">
              <i class="fas fa-info-circle"></i>
            </button>
          </div>
        </div>
        ${rank && type === 'trending' ? `<div class="movie-rank">${rank}</div>` : ''}
      </div>
      <div class="movie-info">
        <h3 class="movie-title">${movie.title}</h3>
        <div class="movie-meta">
          <span class="movie-rating">★ ${rating}</span>
          <span class="movie-year">${year}</span>
          <span class="movie-genre">${genres}</span>
        </div>
        <p class="movie-description">${this.truncateText(movie.description, 100)}</p>
      </div>
    `;

    // Bind events to action buttons
    this.bindMovieCardEvents(movieCard);

    return movieCard;
  }

  bindMovieCardEvents(movieCard) {
    const movieId = movieCard.dataset.movieId;

    // Play button
    const playBtn = movieCard.querySelector('.play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.playMovie(movieId);
      });
    }

    // Watchlist button
    const watchlistBtn = movieCard.querySelector('.watchlist-btn');
    if (watchlistBtn) {
      watchlistBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.watchlistManager.toggleWatchlist(movieId);
      });
    }

    // Info button
    const infoBtn = movieCard.querySelector('.info-btn');
    if (infoBtn) {
      infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showMovieDetails(movieId);
      });
    }

    // Movie card click
    movieCard.addEventListener('click', () => {
      this.showMovieDetails(movieId);
    });
  }

  // Movie Action Methods
  async playMovie(movieId) {
    // Placeholder for play functionality
    this.showNotification('Play functionality coming soon!', 'info');
  }

  async showMovieDetails(movieId) {
    try {
      const response = await netflixAPI.getMovieById(movieId);
      
      if (response.success) {
        this.openMovieModal(response.data);
      }
    } catch (error) {
      console.error('Failed to load movie details:', error);
      this.showNotification('Failed to load movie details', 'error');
    }
  }

  openMovieModal(movie) {
    // Create or update movie modal
    let modal = document.getElementById('movieModal');
    
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'movieModal';
      modal.className = 'modal movie-modal';
      document.body.appendChild(modal);
    }

    const posterUrl = movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image';
    const bannerUrl = movie.bannerUrl || posterUrl;
    const rating = movie.rating ? movie.rating.toFixed(1) : 'N/A';
    const genres = movie.genre ? movie.genre.join(', ') : 'Unknown';
    const cast = movie.cast ? movie.cast.slice(0, 5).join(', ') : 'Unknown';
    const year = movie.releaseYear || 'Unknown';
    const duration = movie.duration || 'Unknown';

    modal.innerHTML = `
      <div class="modal-content movie-modal-content">
        <span class="close-modal">&times;</span>
        <div class="movie-hero" style="background-image: url('${bannerUrl}')">
          <div class="movie-hero-content">
            <h1>${movie.title}</h1>
            <div class="movie-hero-meta">
              <span class="rating">★ ${rating}</span>
              <span class="year">${year}</span>
              <span class="duration">${duration}</span>
              <span class="genre">${genres}</span>
            </div>
            <div class="movie-hero-actions">
              <button class="btn btn-primary play-btn-modal" data-movie-id="${movie._id}">
                <i class="fas fa-play"></i> Play
              </button>
              ${window.authManager && window.authManager.isLoggedIn() ? `
                <button class="btn btn-secondary watchlist-btn-modal" data-movie-id="${movie._id}">
                  <i class="fas fa-plus"></i> Add to Watchlist
                </button>
              ` : ''}
            </div>
          </div>
        </div>
        <div class="movie-details">
          <div class="movie-description">
            <h3>Overview</h3>
            <p>${movie.description}</p>
          </div>
          <div class="movie-info-grid">
            <div class="info-item">
              <strong>Cast:</strong> ${cast}
            </div>
            <div class="info-item">
              <strong>Director:</strong> ${movie.director || 'Unknown'}
            </div>
            <div class="info-item">
              <strong>Language:</strong> ${movie.language || 'Unknown'}
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind modal events
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => this.closeMovieModal());

    const playBtn = modal.querySelector('.play-btn-modal');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.playMovie(movie._id);
        this.closeMovieModal();
      });
    }

    const watchlistBtn = modal.querySelector('.watchlist-btn-modal');
    if (watchlistBtn) {
      watchlistBtn.addEventListener('click', () => {
        window.watchlistManager.toggleWatchlist(movie._id);
      });
    }

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeMovieModal();
      }
    });

    modal.style.display = 'flex';
  }

  closeMovieModal() {
    const modal = document.getElementById('movieModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  // UI Helper Methods
  showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '<div class="loading">Loading movies...</div>';
    }
  }

  showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `<div class="error-message">${message}</div>`;
    }
  }

  showSearchResults() {
    const searchSection = document.getElementById('searchResultsSection');
    if (searchSection) {
      searchSection.style.display = 'block';
    }
    this.hideMainSections();
  }

  showFilteredResults(genre) {
    const filteredSection = document.getElementById('filteredResultsSection');
    if (filteredSection) {
      filteredSection.style.display = 'block';
    }
    this.hideMainSections();
  }

  hideMainSections() {
    const sections = ['trendingSection', 'popularSection', 'newReleasesSection'];
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) section.style.display = 'none';
    });
  }

  showMainSections() {
    const sections = ['trendingSection', 'popularSection', 'newReleasesSection'];
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) section.style.display = 'block';
    });

    // Hide search and filtered sections
    const searchSection = document.getElementById('searchResultsSection');
    const filteredSection = document.getElementById('filteredResultsSection');
    
    if (searchSection) searchSection.style.display = 'none';
    if (filteredSection) filteredSection.style.display = 'none';
  }

  showNotification(message, type = 'info') {
    if (window.authManager) {
      window.authManager.showNotification(message, type);
    }
  }

  truncateText(text, length) {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  }
}

// Initialize movie manager
window.movieManager = new MovieManager();
