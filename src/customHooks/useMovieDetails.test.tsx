import { renderHook, cleanup, waitFor } from '@testing-library/react';
import { useMovieDetails } from './useMovieDetails';
import { fetchData } from '../utils/networkRequests';
import { vi, Mock, beforeEach, afterEach, describe, it, expect } from 'vitest';

vi.mock('../utils/networkRequests');

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

describe('useMovieDetails Custom Hook', () => {
  const mockUrl = 'http://example.com/';
  const mockMovieId = 'tt1234567';
  const mockMovieDetails = {
    Title: 'Test Movie',
    Year: '2021',
    Poster: 'http://example.com/poster.jpg',
    Runtime: '120 min',
    imdbRating: '8.0',
    Plot: 'This is a test plot.',
    Released: '2021-01-01',
    Actors: 'Actor 1, Actor 2',
    Director: 'Director 1',
    Genre: 'Action, Adventure',
    Writer: 'Writer 1',
  };

  it('should fetch movie details successfully', async () => {
    (fetchData as Mock).mockResolvedValue({
      data: mockMovieDetails,
      error: null,
    });

    const { result } = renderHook(() => useMovieDetails(mockUrl, mockMovieId));

    expect(result.current.isMovieDetailsLoading).toBe(true);

    await waitFor(() =>
      expect(result.current.isMovieDetailsLoading).toBe(false)
    );
    expect(result.current.movieDetails).toEqual(mockMovieDetails);
    expect(result.current.fetchMovieDetailsError).toBeNull();
  });

  it('should handle fetch error', async () => {
    const mockError = new Error('Failed to fetch');
    (fetchData as Mock).mockResolvedValue({ data: null, error: mockError });

    const { result } = renderHook(() => useMovieDetails(mockUrl, mockMovieId));

    await waitFor(() =>
      expect(result.current.isMovieDetailsLoading).toBe(true)
    );

    expect(result.current.isMovieDetailsLoading).toBe(false);
    expect(result.current.movieDetails).toBeNull();
    expect(result.current.fetchMovieDetailsError).toEqual(mockError);
  });

  it('should not fetch movie details if no movie ID is provided', async () => {
    const { result } = renderHook(() => useMovieDetails(mockUrl, ''));

    expect(result.current.isMovieDetailsLoading).toBe(false);
    expect(result.current.movieDetails).toBeNull();
    expect(result.current.fetchMovieDetailsError).toBeNull();
  });
});
