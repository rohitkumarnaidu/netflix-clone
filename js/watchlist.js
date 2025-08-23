/**
 * Netflix Clone Watchlist Manager
 * Handles user watchlist operations and UI
 */

class WatchlistManager {
  constructor() {
    this.watchlist = new Map();
    this.watchlistStats = null;
    this.init();
  }

  init() {
    this.bindEvents();
    
    // Load watchlist if user is logged in
    if (window.authManager && window.authManager.isLoggedIn()) {
      this.loadWatchlist();
    }
  }

  bindEvents() {
    // Watchlist page navigation
    const watchlistNavBtn = document.getElementById('watchlistNavBtn');
    if (watchlistNavBtn) {
      watchlistNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showWatchlistPage();
      });
    }

    // My List button in user menu
    const myListBtn = document.getElementById('myListBtn');
    if (myListBtn) {
      myListBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showWatchlistPage();
      });
    }
  }

  async loadWatchlist() {
    if (!window.authManager || !window.authManager.isLoggedIn()) {
      return;
    }

    try {
      const [watchlistResponse, statsResponse] = await Promise.all([
        netflixAPI.getWatchlist(),
        netflixAPI.getWatchlistStats()
      ]);

      if (watchlistResponse.success) {
        this.watchlist.clear();
        watchlistResponse.data.forEach(item => {
          this.watchlist.set(item.movie._id, item);
        });
        this.updateWatchlistUI();
      }

      if (statsResponse.success) {
        this.watchlistStats = statsResponse.data;
      }

    } catch (error) {
      console.error('Failed to load watchlist:', error);
    }
  }

  async toggleWatchlist(movieId) {
    if (!window.authManager || !window.authManager.isLoggedIn()) {
      window.authManager.showAuthModal('login');
      return;
    }

    try {
      const isInWatchlist = this.watchlist.has(movieId);
      
      if (isInWatchlist) {
        await this.removeFromWatchlist(movieId);
      } else {
        await this.addToWatchlist(movieId);
      }
    } catch (error) {
      console.error('Failed to toggle watchlist:', error);
      this.showNotification('Failed to update watchlist', 'error');
    }
  }

  async addToWatchlist(movieId) {
    try {
      const response = await netflixAPI.addToWatchlist(movieId);
      
      if (response.success) {
        this.watchlist.set(movieId, response.data);
        this.updateMovieWatchlistButton(movieId, true);
        this.showNotification('Added to My List', 'success');
        
        // Update stats
        await this.updateStats();
      }
    } catch (error) {
      if (error.message.includes('already in watchlist')) {
        this.showNotification('Movie is already in your list', 'info');
      } else {
        throw error;
      }
    }
  }

  async removeFromWatchlist(movieId) {
    try {
      const response = await netflixAPI.removeFromWatchlist(movieId);
      
      if (response.success) {
        this.watchlist.delete(movieId);
        this.updateMovieWatchlistButton(movieId, false);
        this.showNotification('Removed from My List', 'success');
        
        // Update stats
        await this.updateStats();
        
        // If we're on the watchlist page, remove the item
        this.removeFromWatchlistPage(movieId);
      }
    } catch (error) {
      throw error;
    }
  }

  async updateWatchlistItem(movieId, updates) {
    if (!window.authManager || !window.authManager.isLoggedIn()) {
      return;
    }

    try {
      const response = await netflixAPI.updateWatchlistItem(movieId, updates);
      
      if (response.success) {
        this.watchlist.set(movieId, response.data);
        this.showNotification('Watchlist item updated', 'success');
      }
    } catch (error) {
      console.error('Failed to update watchlist item:', error);
      this.showNotification('Failed to update item', 'error');
    }
  }

  async markAsWatched(movieId, watched = true) {
    await this.updateWatchlistItem(movieId, { watched });
  }

  async rateMovie(movieId, rating) {
    await this.updateWatchlistItem(movieId, { rating });
  }

  updateMovieWatchlistButton(movieId, inWatchlist) {
    const buttons = document.querySelectorAll(`[data-movie-id="${movieId}"] .watchlist-btn, .watchlist-btn-modal[data-movie-id="${movieId}"]`);
    
    buttons.forEach(button => {
      const icon = button.querySelector('i');
      if (inWatchlist) {
        icon.className = 'fas fa-check';
        button.setAttribute('title', 'Remove from My List');
        button.classList.add('in-watchlist');
      } else {
        icon.className = 'fas fa-plus';
        button.setAttribute('title', 'Add to My List');
        button.classList.remove('in-watchlist');
      }
    });
  }

  updateWatchlistUI() {
    // Update all movie cards to show correct watchlist state
    this.watchlist.forEach((item, movieId) => {
      this.updateMovieWatchlistButton(movieId, true);
    });

    // Update watchlist count in navigation
    this.updateWatchlistCount();
  }

  updateWatchlistCount() {
    const countElements = document.querySelectorAll('.watchlist-count');
    const count = this.watchlist.size;
    
    countElements.forEach(element => {
      element.textContent = count;
      element.style.display = count > 0 ? 'inline' : 'none';
    });
  }

  async updateStats() {
    try {
      const response = await netflixAPI.getWatchlistStats();
      if (response.success) {
        this.watchlistStats = response.data;
      }
    } catch (error) {
      console.error('Failed to update watchlist stats:', error);
    }
  }

  showWatchlistPage() {
    if (!window.authManager || !window.authManager.isLoggedIn()) {
      window.authManager.showAuthModal('login');
      return;
    }

    // Hide main content, show watchlist page
    this.hideMainContent();
    this.renderWatchlistPage();
  }

  hideMainContent() {
    const mainSections = [
      'heroSection',
      'trendingSection', 
      'popularSection', 
      'newReleasesSection',
      'searchResultsSection',
      'filteredResultsSection'
    ];

    mainSections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) section.style.display = 'none';
    });
  }

  showMainContent() {
    const mainSections = [
      'heroSection',
      'trendingSection', 
      'popularSection', 
      'newReleasesSection'
    ];

    mainSections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) section.style.display = 'block';
    });

    // Hide watchlist page
    const watchlistPage = document.getElementById('watchlistPage');
    if (watchlistPage) {
      watchlistPage.style.display = 'none';
    }
  }

  renderWatchlistPage() {
    let watchlistPage = document.getElementById('watchlistPage');
    
    if (!watchlistPage) {
      watchlistPage = document.createElement('div');
      watchlistPage.id = 'watchlistPage';
      watchlistPage.className = 'watchlist-page';
      
      // Insert after header
      const header = document.querySelector('header');
      header.insertAdjacentElement('afterend', watchlistPage);
    }

    const watchlistArray = Array.from(this.watchlist.values());
    
    watchlistPage.innerHTML = `
      <div class="container">
        <div class="watchlist-header">
          <div class="watchlist-title">
            <button id="backToHome" class="back-btn">
              <i class="fas fa-arrow-left"></i>
            </button>
            <h1>My List</h1>
          </div>
          ${this.watchlistStats ? this.renderWatchlistStats() : ''}
        </div>
        
        <div class="watchlist-filters">
          <button class="filter-btn active" data-filter="all">All (${watchlistArray.length})</button>
          <button class="filter-btn" data-filter="unwatched">
            Unwatched (${watchlistArray.filter(item => !item.watched).length})
          </button>
          <button class="filter-btn" data-filter="watched">
            Watched (${watchlistArray.filter(item => item.watched).length})
          </button>
        </div>

        <div class="watchlist-content">
          ${watchlistArray.length > 0 ? 
            this.renderWatchlistItems(watchlistArray) : 
            this.renderEmptyWatchlist()
          }
        </div>
      </div>
    `;

    watchlistPage.style.display = 'block';

    // Bind events
    this.bindWatchlistPageEvents(watchlistPage);
  }

  renderWatchlistStats() {
    if (!this.watchlistStats) return '';

    return `
      <div class="watchlist-stats">
        <div class="stat-item">
          <span class="stat-number">${this.watchlistStats.totalMovies}</span>
          <span class="stat-label">Total Movies</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${this.watchlistStats.watchedMovies}</span>
          <span class="stat-label">Watched</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${this.watchlistStats.avgRating || 0}</span>
          <span class="stat-label">Avg Rating</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${this.watchlistStats.watchProgress || 0}%</span>
          <span class="stat-label">Progress</span>
        </div>
      </div>
    `;
  }

  renderWatchlistItems(items) {
    return `
      <div class="watchlist-grid">
        ${items.map(item => this.renderWatchlistItem(item)).join('')}
      </div>
    `;
  }

  renderWatchlistItem(item) {
    const movie = item.movie;
    const posterUrl = movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image';
    const rating = movie.rating ? movie.rating.toFixed(1) : 'N/A';
    const userRating = item.rating || 0;
    const addedDate = new Date(item.addedAt).toLocaleDateString();

    return `
      <div class="watchlist-item ${item.watched ? 'watched' : ''}" data-movie-id="${movie._id}">
        <div class="watchlist-item-poster">
          <img src="${posterUrl}" alt="${movie.title}" loading="lazy">
          <div class="watchlist-item-overlay">
            <button class="action-btn play-btn" data-movie-id="${movie._id}">
              <i class="fas fa-play"></i>
            </button>
            <button class="action-btn remove-btn" data-movie-id="${movie._id}">
              <i class="fas fa-minus"></i>
            </button>
          </div>
          ${item.watched ? '<div class="watched-badge"><i class="fas fa-check"></i></div>' : ''}
        </div>
        
        <div class="watchlist-item-info">
          <h3 class="watchlist-item-title">${movie.title}</h3>
          <div class="watchlist-item-meta">
            <span class="movie-rating">★ ${rating}</span>
            <span class="movie-year">${movie.releaseYear}</span>
            <span class="added-date">Added ${addedDate}</span>
          </div>
          
          <div class="watchlist-item-actions">
            <button class="btn btn-small ${item.watched ? 'btn-secondary' : 'btn-primary'} watch-toggle" 
                    data-movie-id="${movie._id}">
              ${item.watched ? 'Mark Unwatched' : 'Mark Watched'}
            </button>
            
            <div class="rating-section">
              <span>Your Rating:</span>
              <div class="star-rating" data-movie-id="${movie._id}">
                ${[1,2,3,4,5].map(star => `
                  <i class="fas fa-star ${star <= userRating ? 'active' : ''}" 
                     data-rating="${star}"></i>
                `).join('')}
              </div>
            </div>
          </div>
          
          ${item.notes ? `<p class="watchlist-notes">${item.notes}</p>` : ''}
        </div>
      </div>
    `;
  }

  renderEmptyWatchlist() {
    return `
      <div class="empty-watchlist">
        <i class="fas fa-heart"></i>
        <h2>Your list is empty</h2>
        <p>Add movies to your list to watch them later</p>
        <button id="browseMovies" class="btn btn-primary">Browse Movies</button>
      </div>
    `;
  }

  bindWatchlistPageEvents(page) {
    // Back to home button
    const backBtn = page.querySelector('#backToHome');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.showMainContent());
    }

    // Browse movies button (for empty state)
    const browseBtn = page.querySelector('#browseMovies');
    if (browseBtn) {
      browseBtn.addEventListener('click', () => this.showMainContent());
    }

    // Filter buttons
    const filterBtns = page.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active filter
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter watchlist
        this.filterWatchlist(btn.dataset.filter);
      });
    });

    // Remove buttons
    const removeBtns = page.querySelectorAll('.remove-btn');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const movieId = btn.dataset.movieId;
        this.removeFromWatchlist(movieId);
      });
    });

    // Watch toggle buttons
    const watchToggleBtns = page.querySelectorAll('.watch-toggle');
    watchToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const movieId = btn.dataset.movieId;
        const item = this.watchlist.get(movieId);
        this.markAsWatched(movieId, !item.watched);
        
        // Update UI immediately
        setTimeout(() => this.renderWatchlistPage(), 500);
      });
    });

    // Star ratings
    const starRatings = page.querySelectorAll('.star-rating');
    starRatings.forEach(rating => {
      const stars = rating.querySelectorAll('.fa-star');
      const movieId = rating.dataset.movieId;
      
      stars.forEach((star, index) => {
        star.addEventListener('click', () => {
          const ratingValue = index + 1;
          this.rateMovie(movieId, ratingValue);
          
          // Update stars visually
          stars.forEach((s, i) => {
            s.classList.toggle('active', i < ratingValue);
          });
        });
      });
    });

    // Play buttons
    const playBtns = page.querySelectorAll('.play-btn');
    playBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const movieId = btn.dataset.movieId;
        window.movieManager.playMovie(movieId);
      });
    });
  }

  filterWatchlist(filter) {
    const items = document.querySelectorAll('.watchlist-item');
    
    items.forEach(item => {
      const isWatched = item.classList.contains('watched');
      let show = true;
      
      switch (filter) {
        case 'watched':
          show = isWatched;
          break;
        case 'unwatched':
          show = !isWatched;
          break;
        case 'all':
        default:
          show = true;
          break;
      }
      
      item.style.display = show ? 'block' : 'none';
    });
  }

  removeFromWatchlistPage(movieId) {
    const item = document.querySelector(`.watchlist-item[data-movie-id="${movieId}"]`);
    if (item) {
      item.remove();
      
      // Check if watchlist is now empty
      const remainingItems = document.querySelectorAll('.watchlist-item');
      if (remainingItems.length === 0) {
        setTimeout(() => this.renderWatchlistPage(), 500);
      }
    }
  }

  isInWatchlist(movieId) {
    return this.watchlist.has(movieId);
  }

  getWatchlistItem(movieId) {
    return this.watchlist.get(movieId);
  }

  showNotification(message, type = 'info') {
    if (window.authManager) {
      window.authManager.showNotification(message, type);
    }
  }
}

// Initialize watchlist manager
window.watchlistManager = new WatchlistManager();
