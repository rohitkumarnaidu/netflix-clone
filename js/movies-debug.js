/**
 * Debug version of movies.js with extensive logging
 */

class MovieManager {
    constructor() {
        console.log('🎬 MovieManager constructor called');
        this.api = window.netflixAPI;
        console.log('📡 API instance:', this.api);
        
        this.currentMovies = {
            trending: [],
            popular: [],
            new: []
        };
        this.searchResults = [];
        this.currentGenre = 'all';
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('🚀 MovieManager init called');
        this.setupEventListeners();
        this.loadInitialMovies();
    }

    setupEventListeners() {
        console.log('🎧 Setting up event listeners');
        
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const clearSearch = document.getElementById('clearSearch');

        if (searchInput) {
            console.log('✅ Search input found');
            searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        } else {
            console.warn('⚠️ Search input not found');
        }

        if (searchButton) {
            console.log('✅ Search button found');
            searchButton.addEventListener('click', this.handleSearch.bind(this));
        } else {
            console.warn('⚠️ Search button not found');
        }

        if (clearSearch) {
            console.log('✅ Clear search button found');
            clearSearch.addEventListener('click', this.clearSearch.bind(this));
        } else {
            console.warn('⚠️ Clear search button not found');
        }

        // Genre filter buttons
        document.querySelectorAll('.genre-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleGenreFilter(e.target.dataset.genre);
            });
        });
        console.log('✅ Genre buttons set up');
    }

    async loadInitialMovies() {
        console.log('📥 Loading initial movies...');
        try {
            this.showLoading();
            
            // Test API connection first
            console.log('🔍 Testing API connection...');
            const healthCheck = await fetch('http://localhost:5000/api/health');
            console.log('🏥 Health check response:', healthCheck.status);
            
            if (!healthCheck.ok) {
                throw new Error('API health check failed');
            }
            
            // Load all movie categories
            console.log('📊 Loading movie categories...');
            const [trending, popular, newReleases] = await Promise.all([
                this.loadTrendingMovies(),
                this.loadPopularMovies(),
                this.loadNewReleases()
            ]);

            this.hideLoading();
            console.log('✅ All movies loaded successfully');
        } catch (error) {
            console.error('❌ Error loading initial movies:', error);
            this.showError('Failed to load movies. Using fallback data.');
            this.loadFallbackMovies();
        }
    }

    async loadTrendingMovies() {
        console.log('🔥 Loading trending movies...');
        try {
            const response = await this.api.getTrendingMovies();
            console.log('📡 Trending API response:', response);
            
            if (response.success && response.data) {
                this.currentMovies.trending = response.data;
                console.log('✅ Trending movies loaded:', this.currentMovies.trending.length);
                this.renderMovieRow('trending-movies', this.currentMovies.trending);
            } else {
                console.warn('⚠️ No trending movies found, using placeholders');
                this.renderPlaceholderMovies('trending-movies');
            }
        } catch (error) {
            console.error('❌ Error loading trending movies:', error);
            this.renderPlaceholderMovies('trending-movies');
        }
    }

    async loadPopularMovies() {
        console.log('⭐ Loading popular movies...');
        try {
            const response = await this.api.getPopularMovies();
            console.log('📡 Popular API response:', response);
            
            if (response.success && response.data) {
                this.currentMovies.popular = response.data;
                console.log('✅ Popular movies loaded:', this.currentMovies.popular.length);
                this.renderMovieRow('popular-movies', this.currentMovies.popular);
            } else {
                console.warn('⚠️ No popular movies found, using placeholders');
                this.renderPlaceholderMovies('popular-movies');
            }
        } catch (error) {
            console.error('❌ Error loading popular movies:', error);
            this.renderPlaceholderMovies('popular-movies');
        }
    }

    async loadNewReleases() {
        console.log('🆕 Loading new releases...');
        try {
            const response = await this.api.getNewReleases();
            console.log('📡 New releases API response:', response);
            
            if (response.success && response.data) {
                this.currentMovies.new = response.data;
                console.log('✅ New releases loaded:', this.currentMovies.new.length);
                this.renderMovieRow('new-releases', this.currentMovies.new);
            } else {
                console.warn('⚠️ No new releases found, using placeholders');
                this.renderPlaceholderMovies('new-releases');
            }
        } catch (error) {
            console.error('❌ Error loading new releases:', error);
            this.renderPlaceholderMovies('new-releases');
        }
    }

    renderMovieRow(containerId, movies) {
        console.log(`🎨 Rendering movie row: ${containerId} with ${movies.length} movies`);
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`❌ Container not found: ${containerId}`);
            return;
        }

        // Ensure exactly 10 movies are displayed
        const targetMovies = this.ensureExactMovieCount(movies || [], 10);
        
        const movieCards = targetMovies.map(movie => this.createMovieCard(movie)).join('');
        container.innerHTML = movieCards;
        console.log(`✅ Rendered exactly ${targetMovies.length} movie cards in ${containerId}`);
        
        // Refresh carousel after rendering
        if (window.netflixCarousel) {
            const rowElement = container.closest('.movie-row');
            if (rowElement && rowElement.id) {
                window.netflixCarousel.refreshCarousel(rowElement.id);
            }
        }
    }

    ensureExactMovieCount(movies, targetCount) {
        console.log(`🎯 Ensuring exactly ${targetCount} movies from ${movies.length} available`);
        
        if (movies.length === 0) {
            // No movies available, generate all placeholders
            return this.generatePlaceholderMovies(targetCount);
        }
        
        if (movies.length >= targetCount) {
            // Enough movies, return first targetCount
            return movies.slice(0, targetCount);
        }
        
        // Not enough movies, duplicate existing ones to reach target
        const result = [...movies];
        while (result.length < targetCount) {
            const remainingNeeded = targetCount - result.length;
            const moviesToAdd = movies.slice(0, Math.min(remainingNeeded, movies.length));
            
            // Add unique IDs to duplicated movies to avoid conflicts
            const duplicatedMovies = moviesToAdd.map((movie, index) => ({
                ...movie,
                _id: `${movie._id}-dup-${result.length + index}`,
                title: `${movie.title}` // Keep original title
            }));
            
            result.push(...duplicatedMovies);
        }
        
        console.log(`✅ Created exactly ${result.length} movies (${movies.length} original + ${result.length - movies.length} duplicated)`);
        return result;
    }

    renderPlaceholderMovies(containerId) {
        console.log(`🎭 Rendering placeholder movies for: ${containerId}`);
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`❌ Container not found: ${containerId}`);
            return;
        }

        const placeholderMovies = this.generatePlaceholderMovies(10);
        const movieCards = placeholderMovies.map(movie => this.createMovieCard(movie)).join('');
        container.innerHTML = movieCards;
        console.log(`✅ Rendered ${placeholderMovies.length} placeholder cards in ${containerId}`);
        
        // Refresh carousel after rendering
        if (window.netflixCarousel) {
            const rowElement = container.closest('.movie-row');
            if (rowElement && rowElement.id) {
                window.netflixCarousel.refreshCarousel(rowElement.id);
            }
        }
    }

    generatePlaceholderMovies(count) {
        const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller'];
        const titles = [
            'The Dark Knight', 'Inception', 'Interstellar', 'The Matrix', 'Pulp Fiction',
            'The Godfather', 'Forrest Gump', 'The Shawshank Redemption'
        ];
        const placeholderMovies = [];

        for (let i = 0; i < count; i++) {
            placeholderMovies.push({
                _id: `placeholder-${i}`,
                title: titles[i % titles.length] || `Movie ${i + 1}`,
                description: 'An exciting movie that will keep you entertained.',
                genre: [genres[i % genres.length]],
                rating: (Math.random() * 4 + 6).toFixed(1),
                releaseYear: 2018 + Math.floor(Math.random() * 6),
                posterUrl: `https://via.placeholder.com/200x300/333333/ffffff?text=${encodeURIComponent(titles[i % titles.length] || `Movie ${i + 1}`)}`,
                bannerUrl: `https://via.placeholder.com/500x300/333333/ffffff?text=${encodeURIComponent(titles[i % titles.length] || `Movie ${i + 1}`)}`
            });
        }

        return placeholderMovies;
    }

    createMovieCard(movie) {
        // Validate movie object
        if (!movie || !movie.title) {
            console.warn('⚠️ Invalid movie object, using fallback');
            movie = {
                _id: 'fallback-' + Date.now(),
                title: 'Movie Title',
                description: 'Movie description not available.',
                rating: 'N/A',
                releaseYear: new Date().getFullYear(),
                genre: ['Unknown']
            };
        }
        
        // Handle poster image with comprehensive fallback logic
        const getFallbackImage = () => {
            return 'https://via.placeholder.com/300x450/000000/FFFFFF?text=No+Image';
        };
        
        let posterUrl;
        // Check if poster_path exists and is valid
        if (movie.poster_path && 
            movie.poster_path !== 'undefined' && 
            movie.poster_path !== 'null' && 
            movie.poster_path.trim() !== '') {
            posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        } else if (movie.posterUrl && 
                   movie.posterUrl !== 'undefined' && 
                   movie.posterUrl !== 'null' && 
                   movie.posterUrl.trim() !== '') {
            posterUrl = movie.posterUrl;
        } else if (movie.poster && 
                   movie.poster !== 'undefined' && 
                   movie.poster !== 'null' && 
                   movie.poster.trim() !== '') {
            posterUrl = movie.poster;
        } else {
            // Use fallback placeholder for missing/invalid poster_path
            posterUrl = getFallbackImage();
        }
        
        const rating = movie.rating || 'N/A';
        const year = movie.releaseYear || movie.year || 'N/A';
        const genre = Array.isArray(movie.genre) ? movie.genre.join(', ') : (movie.genre || 'Unknown');

        return `
            <div class="movie-card" data-movie-id="${movie._id || 'unknown'}">
                <div class="movie-poster-container">
                    <img src="${posterUrl}" 
                         alt="${movie.title || 'Movie'}" 
                         class="movie-poster"
                         loading="lazy"
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/300x450/000000/FFFFFF?text=No+Image'; this.classList.add('fallback-image');">
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
                    <h3 class="movie-title">${movie.title || 'Unknown Movie'}</h3>
                    <div class="movie-meta">
                        <span class="movie-rating">⭐ ${rating}</span>
                        <span class="movie-year">${year}</span>
                        <span class="movie-genre">${genre}</span>
                    </div>
                </div>
            </div>
        `;
    }

    loadFallbackMovies() {
        console.log('🔄 Loading fallback movies...');
        this.renderPlaceholderMovies('trending-movies');
        this.renderPlaceholderMovies('popular-movies');
        this.renderPlaceholderMovies('new-releases');
    }

    async handleSearch() {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput?.value.trim();

        if (!query) {
            this.clearSearch();
            return;
        }

        console.log('🔍 Searching for:', query);
        // For now, just show placeholder results
        this.showNoResults();
    }

    clearSearch() {
        console.log('🧹 Clearing search');
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
        console.log('🎭 Filtering by genre:', genre);
        // Update active button
        document.querySelectorAll('.genre-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-genre="${genre}"]`)?.classList.add('active');
        this.currentGenre = genre;
    }

    showMainSections() {
        const sections = ['trendingSection', 'popularSection', 'newReleasesSection'];
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) section.style.removeProperty('display');
        });
    }

    showNoResults() {
        console.log('📭 Showing no results message');
        // Implementation for no results
    }

    showLoading() {
        console.log('⏳ Showing loading state');
    }

    hideLoading() {
        console.log('✅ Hiding loading state');
    }

    showError(message) {
        console.error('💥 Error:', message);
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

// Initialize when DOM is loaded
console.log('🎬 Loading MovieManager...');
window.movieManager = new MovieManager();
