import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from './MovieCard';

describe('MovieCard Component', () => {
  const mockMovie = {
    _id: '1',
    title: 'Test Movie',
    poster_path: '/test-poster.jpg',
    rating: 8.5,
    releaseYear: 2023,
    genre: ['Action', 'Drama']
  };

  test('renders movie card with valid poster_path', () => {
    render(<MovieCard movie={mockMovie} />);
    
    const image = screen.getByAltText('Test Movie');
    expect(image).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/test-poster.jpg');
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('⭐ 8.5')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('Action, Drama')).toBeInTheDocument();
  });

  test('renders fallback image when poster_path is null', () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null };
    render(<MovieCard movie={movieWithoutPoster} />);
    
    const image = screen.getByAltText('Test Movie');
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/300x450/000000/FFFFFF?text=No+Image');
  });

  test('renders fallback image when poster_path is undefined', () => {
    const movieWithoutPoster = { ...mockMovie };
    delete movieWithoutPoster.poster_path;
    render(<MovieCard movie={movieWithoutPoster} />);
    
    const image = screen.getByAltText('Test Movie');
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/300x450/000000/FFFFFF?text=No+Image');
  });

  test('renders fallback image when poster_path is empty string', () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: '' };
    render(<MovieCard movie={movieWithoutPoster} />);
    
    const image = screen.getByAltText('Test Movie');
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/300x450/000000/FFFFFF?text=No+Image');
  });

  test('handles image load error by showing fallback', () => {
    render(<MovieCard movie={mockMovie} />);
    
    const image = screen.getByAltText('Test Movie');
    
    // Simulate image load error
    fireEvent.error(image);
    
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/300x450/000000/FFFFFF?text=No+Image');
    expect(image).toHaveClass('fallback-image');
  });

  test('displays movie metadata consistently', () => {
    const movieWithMinimalData = {
      _id: '2',
      title: 'Minimal Movie'
    };
    
    render(<MovieCard movie={movieWithMinimalData} />);
    
    expect(screen.getByText('Minimal Movie')).toBeInTheDocument();
    expect(screen.getByText('⭐ N/A')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});
