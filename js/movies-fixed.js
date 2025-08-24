/**
 * Enhanced Movies JavaScript for Netflix Clone
 * Handles movie display, search, and interactions with proper placeholder images
 */

class MovieManager {
    constructor() {
        this.api = window.netflixAPI;
        this.currentMovies = {
            trending: [],
            popular: [],
            new: []
        };
        this.searchResults = [];
        this.currentGenre = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialMovies();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const clearSearch = document.getElementById('clearSearch');

        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        }

        if (searchButton) {
            searchButton.addEventListener('click', this.handleSearch.bind(this));
        }

        if (clearSearch) {
            clearSearch.addEventListener('click', this.clearSearch.bind(this));
        }

        // Genre filter buttons
        document.querySelectorAll('.genre-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleGenreFilter(e.target.dataset.genre);
            });
        });

        // Movie card interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.movie-card')) {
                this.handleMovieClick(e.target.closest('.movie-card'));
            }
        });
    }

    async loadInitialMovies() {
        try {
            this.showLoading();
            
            // Load all movie categories
            const [trending, popular, newReleases] = await Promise.all([
                this.loadTrendingMovies(),
                this.loadPopularMovies(),
                this.loadNewReleases()
            ]);

            this.hideLoading();
        } catch (error) {
            console.error('Error loading initial movies:', error);
            this.showError('Failed to load movies. Please try again later.');
        }
    }

    async loadTrendingMovies() {
        try {
            const response = await this.api.getTrendingMovies();
            if (response.success) {
                // Backend returns data directly, not data.movies
                this.currentMovies.trending = response.data || [];
                this.renderMovieRow('trending-movies', this.currentMovies.trending);
            } else {
                console.warn('No trending movies found, using placeholders');
                this.renderPlaceholderMovies('trending-movies');
            }
        } catch (error) {
            console.error('Error loading trending movies:', error);
            this.renderPlaceholderMovies('trending-movies');
        }
    }

    async loadPopularMovies() {
        try {
            const response = await this.api.getPopularMovies();
            if (response.success) {
                // Backend returns data directly, not data.movies
                this.currentMovies.popular = response.data || [];
                this.renderMovieRow('popular-movies', this.currentMovies.popular);
            } else {
                console.warn('No popular movies found, using placeholders');
                this.renderPlaceholderMovies('popular-movies');
            }
        } catch (error) {
            console.error('Error loading popular movies:', error);
            this.renderPlaceholderMovies('popular-movies');
        }
    }

    async loadNewReleases() {
        try {
            const response = await this.api.getNewReleases();
            if (response.success) {
                // Backend returns data directly, not data.movies
                this.currentMovies.new = response.data || [];
                this.renderMovieRow('new-releases', this.currentMovies.new);
            } else {
                console.warn('No new releases found, using placeholders');
                this.renderPlaceholderMovies('new-releases');
            }
        } catch (error) {
            console.error('Error loading new releases:', error);
            this.renderPlaceholderMovies('new-releases');
        }
    }

    renderMovieRow(containerId, movies) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!movies || movies.length === 0) {
            this.renderPlaceholderMovies(containerId);
            return;
        }

        container.innerHTML = movies.map(movie => this.createMovieCard(movie)).join('');
    }

    renderPlaceholderMovies(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const placeholderMovies = this.generatePlaceholderMovies(8);
        container.innerHTML = placeholderMovies.map(movie => this.createMovieCard(movie)).join('');
    }

    generatePlaceholderMovies(count) {
        const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Adventure'];
        const titles = [
            'The Dark Knight', 'Inception', 'Interstellar', 'The Matrix', 'Pulp Fiction',
            'The Godfather', 'Forrest Gump', 'The Shawshank Redemption', 'Fight Club', 'Goodfellas',
            'The Lord of the Rings', 'Star Wars', 'Jurassic Park', 'Titanic', 'Avatar'
        ];
        const placeholderMovies = [];

        for (let i = 0; i < count; i++) {
            placeholderMovies.push({
                _id: `placeholder-${i}`,
                title: titles[i % titles.length] || `Movie Title ${i + 1}`,
                description: 'An exciting movie that will keep you on the edge of your seat with thrilling action and compelling storytelling.',
                genre: [genres[i % genres.length]],
                rating: (Math.random() * 4 + 6).toFixed(1),
                releaseYear: 2018 + Math.floor(Math.random() * 6),
                posterUrl: this.getPlaceholderImage(200, 300, `Movie ${i + 1}`),
                bannerUrl: this.getPlaceholderImage(500, 300, `Movie ${i + 1} Banner`)
            });
        }

        return placeholderMovies;
    }

    getPlaceholderImage(width, height, text) {
        // Using a placeholder service that generates images with text
        return `https://via.placeholder.com/${width}x${height}/333333/ffffff?text=${encodeURIComponent(text)}`;
    }

    createMovieCard(movie) {
        const posterUrl = movie.posterUrl || movie.poster || this.getPlaceholderImage(200, 300, movie.title);
        const rating = movie.rating || 'N/A';
        const year = movie.releaseYear || movie.year || 'N/A';
        const genre = Array.isArray(movie.genre) ? movie.genre.join(', ') : (movie.genre || 'Unknown');

        return `
            <div class="movie-card" data-movie-id="${movie._id}">
                <div class="movie-poster-container">
                    <img src="${posterUrl}" 
                         alt="${movie.title}" 
                         class="movie-poster"
                         onerror="this.src='${this.getPlaceholderImage(200, 300, movie.title)}'">
                    <div class="movie-overlay">
                        <div class="movie-actions">
                            <button class="action-btn play-btn" title="Play">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="action-btn watchlist-btn" title="Add to Watchlist">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="action-btn info-btn" title="More Info">
                                <i class="fas fa-info"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <div class="movie-meta">
                        <span class="movie-rating">⭐ ${rating}</span>
                        <span class="movie-year">${year}</span>
                        <span class="movie-genre">${genre}</span>
                    </div>
                </div>
            </div>
        `;
    }

    async handleSearch() {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput?.value.trim();

        if (!query) {
            this.clearSearch();
            return;
        }

        try {
            this.showSearchLoading();
            const response = await this.api.searchMovies(query);
            
            if (response.success && response.data) {
                this.searchResults = response.data;
                this.displaySearchResults();
            } else {
                this.showNoResults();
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showSearchError();
        }
    }

    displaySearchResults() {
        const searchSection = document.getElementById('searchResultsSection');
        const searchResults = document.getElementById('search-results');
        const clearBtn = document.getElementById('clearSearch');

        if (searchSection && searchResults) {
            searchSection.style.display = 'block';
            
            if (this.searchResults.length === 0) {
                searchResults.innerHTML = '<div class="no-results">No movies found matching your search.</div>';
            } else {
                searchResults.innerHTML = this.searchResults.map(movie => this.createMovieCard(movie)).join('');
            }

            if (clearBtn) {
                clearBtn.style.display = 'block';
            }

            // Hide other sections
            this.hideMainSections();
        }
    }

    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchSection = document.getElementById('searchResultsSection');
        const clearBtn = document.getElementById('clearSearch');

        if (searchInput) searchInput.value = '';
        if (searchSection) searchSection.style.display = 'none';
        if (clearBtn) clearBtn.style.display = 'none';

        this.searchResults = [];
        this.showMainSections();
    }

    handleGenreFilter(genre) {
        // Update active button
        document.querySelectorAll('.genre-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-genre="${genre}"]`)?.classList.add('active');

        this.currentGenre = genre;

        if (genre === 'all') {
            this.showMainSections();
            return;
        }

        // Filter movies by genre
        const allMovies = [
            ...this.currentMovies.trending,
            ...this.currentMovies.popular,
            ...this.currentMovies.new
        ];

        const filteredMovies = allMovies.filter(movie => 
            movie.genre && movie.genre.toLowerCase().includes(genre.toLowerCase())
        );

        this.displayFilteredResults(filteredMovies, genre);
    }

    displayFilteredResults(movies, genre) {
        const filteredSection = document.getElementById('filteredResultsSection');
        const filteredResults = document.getElementById('filtered-results');
        const filteredTitle = document.getElementById('filteredResultsTitle');

        if (filteredSection && filteredResults) {
            filteredSection.style.display = 'block';
            
            if (filteredTitle) {
                filteredTitle.textContent = `${genre} Movies`;
            }

            if (movies.length === 0) {
                filteredResults.innerHTML = `<div class="no-results">No ${genre} movies found.</div>`;
            } else {
                filteredResults.innerHTML = movies.map(movie => this.createMovieCard(movie)).join('');
            }

            this.hideMainSections();
        }
    }

    handleMovieClick(movieCard) {
        const movieId = movieCard.dataset.movieId;
        if (movieId && !movieId.startsWith('placeholder-')) {
            this.showMovieDetails(movieId);
        }
    }

    async showMovieDetails(movieId) {
        try {
            const response = await this.api.getMovieById(movieId);
            if (response.success) {
                this.openMovieModal(response.data.movie);
            }
        } catch (error) {
            console.error('Error loading movie details:', error);
        }
    }

    openMovieModal(movie) {
        // Create and show movie modal
        const modal = document.createElement('div');
        modal.className = 'movie-modal';
        modal.innerHTML = `
            <div class="movie-modal-content">
                <button class="close-modal">&times;</button>
                <div class="movie-hero" style="background-image: url('${movie.banner || movie.poster}')">
                    <div class="movie-hero-content">
                        <h1>${movie.title}</h1>
                        <div class="movie-hero-meta">
                            <span>${movie.year}</span>
                            <span>⭐ ${movie.rating}</span>
                            <span>${movie.genre}</span>
                        </div>
                        <div class="movie-hero-actions">
                            <button class="btn btn-primary">
                                <i class="fas fa-play"></i> Play
                            </button>
                            <button class="btn btn-secondary watchlist-modal-btn" data-movie-id="${movie._id}">
                                <i class="fas fa-plus"></i> My List
                            </button>
                        </div>
                    </div>
                </div>
                <div class="movie-details">
                    <div class="movie-description">
                        <h3>About ${movie.title}</h3>
                        <p>${movie.description}</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';

        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    showMainSections() {
        document.getElementById('trendingSection')?.style.removeProperty('display');
        document.getElementById('popularSection')?.style.removeProperty('display');
        document.getElementById('newReleasesSection')?.style.removeProperty('display');
        document.getElementById('searchResultsSection').style.display = 'none';
        document.getElementById('filteredResultsSection')?.style.removeProperty('display');
    }

    hideMainSections() {
        document.getElementById('trendingSection').style.display = 'none';
        document.getElementById('popularSection').style.display = 'none';
        document.getElementById('newReleasesSection').style.display = 'none';
    }

    showLoading() {
        // Show loading state
        console.log('Loading movies...');
    }

    hideLoading() {
        // Hide loading state
        console.log('Movies loaded');
    }

    showSearchLoading() {
        const searchBtn = document.getElementById('searchButton');
        if (searchBtn) {
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }
    }

    showNoResults() {
        const searchSection = document.getElementById('searchResultsSection');
        const searchResults = document.getElementById('search-results');
        
        if (searchSection && searchResults) {
            searchSection.style.display = 'block';
            searchResults.innerHTML = '<div class="no-results">No movies found matching your search.</div>';
            this.hideMainSections();
        }
    }

    showSearchError() {
        const searchSection = document.getElementById('searchResultsSection');
        const searchResults = document.getElementById('search-results');
        
        if (searchSection && searchResults) {
            searchSection.style.display = 'block';
            searchResults.innerHTML = '<div class="error-message">Error searching movies. Please try again.</div>';
            this.hideMainSections();
        }
    }

    showError(message) {
        console.error(message);
        // You can implement a toast notification here
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Enhanced movie row scrolling
function scrollMovieRow(containerId, direction) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const scrollAmount = 300;
    const currentScroll = container.scrollLeft;
    
    if (direction === 'left') {
        container.scrollTo({
            left: Math.max(0, currentScroll - scrollAmount),
            behavior: 'smooth'
        });
    } else {
        container.scrollTo({
            left: currentScroll + scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.movieManager = new MovieManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MovieManager;
}
