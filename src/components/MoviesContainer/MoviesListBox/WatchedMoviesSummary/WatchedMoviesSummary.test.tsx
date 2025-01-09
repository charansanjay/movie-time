import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import "@testing-library/jest-dom";

import WatchedMoviesSummary from './WatchedMoviesSummary.tsx';
import { type WatchedData } from '../../../../App.tsx';
import { average, calcAvgRunTime, parseRuntime } from '../../../../utils/calculate.ts';

describe('WatchedMoviesSummary', () => {

  const watchedMovies: WatchedData[] = [
    {
      imdbID: '1',
      Title: 'Movie 1',
      Year: '2025',
      Poster: 'poster1.jpg',
      runtime: '2h 30m',
      imdbRating: 8.5,
      userRating: 9,
    },
    {
      imdbID: '2',
      Title: 'Movie 2',
      Year: '2025',
      Poster: 'poster2.jpg',
      runtime: '120 min',
      imdbRating: 7.2,
      userRating: 8.1,
    },
    {
      imdbID: '3',
      Title: 'Movie 3',
      Year: '2025',
      Poster: 'poster3.jpg',
      runtime: '1h 45m',
      imdbRating: 6.8,
      userRating: 7.5,
    },
  ];

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders the component without crashing', () => {
    // Arrange
    render(<WatchedMoviesSummary watched={watchedMovies} />);

    // Assert
    expect(screen.getByText('Movies you watched')).toBeInTheDocument();
    expect(screen.getByText('#️⃣')).toBeInTheDocument();
    expect(screen.getByText('⭐️')).toBeInTheDocument();
    expect(screen.getByText('🌟')).toBeInTheDocument();
    expect(screen.getByText('⏳')).toBeInTheDocument();
  });

  it('calculates and displays the average IMDb rating', () => {
    // Arrange
    render(<WatchedMoviesSummary watched={watchedMovies} />);

    // Act
    const avgImdbRating = average(
      watchedMovies.map((movie) => movie.imdbRating)
    ).toFixed(2);

    // Assert
    expect(screen.getByText(avgImdbRating)).toBeInTheDocument();
  });

  it('calculates and displays the average user rating', () => {
    // Arrange
    render(<WatchedMoviesSummary watched={watchedMovies} />);

    // Act
    const avgUserRating = average(
      watchedMovies.map((movie) => movie.userRating)
    ).toFixed(2);

    // Assert
    expect(screen.getByText(avgUserRating)).toBeInTheDocument();
  });

  it('calculates and displays the average runtime', () => {
    // Arrange
    render(<WatchedMoviesSummary watched={watchedMovies} />);

    // Act
    const totalRuntime = watchedMovies.map((movie) => parseRuntime(movie.runtime))
    const avgRuntime = calcAvgRunTime(totalRuntime).toFixed(2);

    // Assert
    expect(screen.getByText(`${avgRuntime} min`)).toBeInTheDocument();
  });

  it('handles empty watched list', () => {
    // Arrange
    render(<WatchedMoviesSummary watched={[]} />);

    // Assert
    expect(screen.getByText('#️⃣')).toBeInTheDocument();
    expect(screen.getByText('⭐️')).toBeInTheDocument();
    expect(screen.getByText('🌟')).toBeInTheDocument();
    expect(screen.getByText('⏳')).toBeInTheDocument();
  });
});