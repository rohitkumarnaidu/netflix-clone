import React, { useState } from 'react';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const [imageError, setImageError] = useState(false);

  // Fallback image URL with black background and white text
  const getFallbackImage = () => {
    return 'https://via.placeholder.com/300x450/000000/FFFFFF?text=No+Image';
  };

  // Determine poster URL with comprehensive validation
  const getPosterUrl = () => {
    // Check if poster_path exists and is valid
    if (movie.poster_path && 
        movie.poster_path !== 'undefined' && 
        movie.poster_path !== 'null' && 
        movie.poster_path !== '' &&
        movie.poster_path.trim() !== '') {
      return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }
    
    // Check alternative poster URL fields
    if (movie.posterUrl && 
        movie.posterUrl !== 'undefined' && 
        movie.posterUrl !== 'null' && 
        movie.posterUrl !== '' &&
        movie.posterUrl.trim() !== '') {
      return movie.posterUrl;
    }
    
    if (movie.poster && 
        movie.poster !== 'undefined' && 
        movie.poster !== 'null' && 
        movie.poster !== '' &&
        movie.poster.trim() !== '') {
      return movie.poster;
    }
    
    // Return fallback immediately for missing/invalid poster_path
    return getFallbackImage();
  };

  // Handle image load error
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    setImageError(true);
  };

  const posterUrl = imageError ? getFallbackImage() : getPosterUrl();
  const movieTitle = movie.title || movie.name || 'Unknown Movie';
  const rating = movie.rating || movie.vote_average || 'N/A';
  const year = movie.releaseYear || movie.release_date?.split('-')[0] || movie.year || 'N/A';
  const genres = Array.isArray(movie.genre) ? movie.genre.join(', ') : 
                Array.isArray(movie.genres) ? movie.genres.map(g => g.name || g).join(', ') :
                (movie.genre || movie.genres || 'Unknown');

  return (
    <div className="movie-card" data-movie-id={movie._id || movie.id || 'unknown'}>
      <div className="movie-poster-container">
        <img 
          src={posterUrl}
          alt={movieTitle}
          className={`movie-poster ${imageError ? 'fallback-image' : ''}`}
          loading="lazy"
          onError={handleImageError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
        <div className="movie-overlay">
          <div className="movie-actions">
            <button className="action-btn play-btn" title="Play">
              <i className="fas fa-play"></i>
            </button>
            <button className="action-btn watchlist-btn" title="Add to Watchlist">
              <i className="fas fa-plus"></i>
            </button>
            <button className="action-btn info-btn" title="More Info">
              <i className="fas fa-info"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movieTitle}</h3>
        <div className="movie-meta">
          <span className="movie-rating">⭐ {rating}</span>
          <span className="movie-year">{year}</span>
          <span className="movie-genre">{genres}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
