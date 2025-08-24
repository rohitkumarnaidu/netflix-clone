/**
 * Netflix-style Carousel Component
 * Handles smooth scrolling for movie rows with left/right navigation
 */

class NetflixCarousel {
    constructor() {
        this.carousels = new Map();
        this.scrollAmount = 300; // pixels to scroll per click
        this.init();
    }

    init() {
        // Initialize all carousels on page load
        document.addEventListener('DOMContentLoaded', () => {
            this.setupCarousels();
        });
    }

    setupCarousels() {
        const movieRows = document.querySelectorAll('.movie-row');
        
        movieRows.forEach((row, index) => {
            const rowId = row.id || `movie-row-${index}`;
            const container = row.querySelector('.movies-container');
            
            if (container) {
                this.createCarouselControls(row, rowId);
                this.carousels.set(rowId, {
                    container: container,
                    row: row,
                    currentScroll: 0
                });
                
                // Update arrow visibility on scroll
                container.addEventListener('scroll', () => {
                    this.updateArrowVisibility(rowId);
                });
                
                // Initial arrow visibility check
                setTimeout(() => this.updateArrowVisibility(rowId), 100);
            }
        });
    }

    createCarouselControls(row, rowId) {
        // Create left arrow
        const leftArrow = document.createElement('button');
        leftArrow.className = 'carousel-arrow carousel-arrow-left';
        leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
        leftArrow.setAttribute('aria-label', 'Previous movies');
        leftArrow.onclick = () => this.scrollLeft(rowId);

        // Create right arrow
        const rightArrow = document.createElement('button');
        rightArrow.className = 'carousel-arrow carousel-arrow-right';
        rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
        rightArrow.setAttribute('aria-label', 'Next movies');
        rightArrow.onclick = () => this.scrollRight(rowId);

        // Add arrows to row
        row.style.position = 'relative';
        row.appendChild(leftArrow);
        row.appendChild(rightArrow);
    }

    scrollLeft(rowId) {
        const carousel = this.carousels.get(rowId);
        if (!carousel) return;

        const container = carousel.container;
        const newScrollLeft = Math.max(0, container.scrollLeft - this.scrollAmount);
        
        container.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    }

    scrollRight(rowId) {
        const carousel = this.carousels.get(rowId);
        if (!carousel) return;

        const container = carousel.container;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const newScrollLeft = Math.min(maxScroll, container.scrollLeft + this.scrollAmount);
        
        container.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    }

    updateArrowVisibility(rowId) {
        const carousel = this.carousels.get(rowId);
        if (!carousel) return;

        const container = carousel.container;
        const row = carousel.row;
        const leftArrow = row.querySelector('.carousel-arrow-left');
        const rightArrow = row.querySelector('.carousel-arrow-right');

        if (!leftArrow || !rightArrow) return;

        const isScrollable = container.scrollWidth > container.clientWidth;
        const isAtStart = container.scrollLeft <= 0;
        const isAtEnd = container.scrollLeft >= (container.scrollWidth - container.clientWidth - 1);

        // Show/hide arrows based on scroll position and content
        if (isScrollable) {
            leftArrow.style.display = isAtStart ? 'none' : 'flex';
            rightArrow.style.display = isAtEnd ? 'none' : 'flex';
        } else {
            leftArrow.style.display = 'none';
            rightArrow.style.display = 'none';
        }
    }

    // Method to refresh carousel after content changes
    refreshCarousel(rowId) {
        setTimeout(() => {
            this.updateArrowVisibility(rowId);
        }, 100);
    }

    // Method to refresh all carousels
    refreshAllCarousels() {
        this.carousels.forEach((carousel, rowId) => {
            this.refreshCarousel(rowId);
        });
    }
}

// Initialize carousel system
window.netflixCarousel = new NetflixCarousel();
