import React from 'react';
import MovieCard from './MovieCard';
import './MovieRow.css';

const MovieRow = ({ title, movies = [] }) => {
  return (
    <div className="movie-section">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <div className="movie-row">
          <div className="movies-container">
            {movies.map((movie, index) => (
              <MovieCard 
                key={movie._id || movie.id || `${title}-${index}`}
                movie={movie}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieRow;
