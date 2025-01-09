import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { type MovieData, useMovies } from './useMovies';
import { fetchData } from '../utils/networkRequests';
import { vi, describe, expect, it, afterEach, Mock, beforeEach } from 'vitest';

vi.mock('../utils/networkRequests');

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

describe('useMovies', () => {
  const url = 'http://example.com/api/movies?';
  const query = 'batman';

  it('should fetch movies for the query string successfully', async () => {
    const mockMovies: MovieData[] = [
      { imdbID: '1', Title: 'Batman Begins', Year: '2005', Poster: 'url1' },
      { imdbID: '2', Title: 'The Dark Knight', Year: '2008', Poster: 'url2' },
    ];
    
    (fetchData as Mock).mockResolvedValue({
      data: { Response: 'True', Search: mockMovies, totalResults: 2 },
      error: null,
    });

    const { result } =  renderHook(() => useMovies(url, query));

    await waitFor(() => expect(result.current.movies).toHaveLength(2)) 
    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.isMoviesLoading).toBe(false);
    expect(result.current.fetchMoviesError).toBeNull();
  });

  it('should handle fetch error', async () => {
    const mockError = new Error('Network Error');

    (fetchData as Mock).mockResolvedValue({
      data: null,
      error: mockError,
    });

    const { result } = renderHook(() => useMovies(url, query));

    await waitFor(() => expect(result.current.movies).toEqual([]));
    expect(result.current.isMoviesLoading).toBe(false);
    expect(result.current.fetchMoviesError).toEqual(mockError);
  });

  it('should handle API error response', async () => {
    (fetchData as Mock).mockResolvedValue({
      data: { Response: 'False', Error: 'Movie not found!' },
      error: null,
    });

    const { result } = renderHook(() => useMovies(url, query));

    await waitFor(() => expect(result.current.movies).toEqual([]));
    expect(result.current.isMoviesLoading).toBe(false);
    expect(result.current.fetchMoviesError).toEqual(new Error('Movie not found!'));
  });

  it('should not fetch movies if query is too short', async () => {
    const shortQuery = 'ba';

    const { result } = renderHook(() => useMovies(url, shortQuery));

    expect(result.current.movies).toEqual([]);
    expect(result.current.isMoviesLoading).toBe(false);
    expect(result.current.fetchMoviesError).toBeNull();
  });
});