import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchData } from './networkRequests.ts';

import { type FetchedMoviesResponse } from '../customHooks/useMovies.tsx';
import { cleanup } from '@testing-library/react';

// Mock the fetch function
const mockFetch = vi.fn();

/**
 * The active selection globalThis in the file networkRequests.test.ts refers to a standard built-in object that provides a way to access the global object across different environments. Unlike global in Node.js or window in browsers, globalThis is a universal reference that works consistently in any JavaScript environment, including Node.js, browsers, web workers, and more.
 * In a project that uses npm, React, and TypeScript, globalThis can be particularly useful for writing cross-environment code. For instance, if you need to define or access global variables or functions that should be available regardless of the environment your code is running in, globalThis ensures that you have a consistent reference.
 * In the context of a test file like networkRequests.test.ts, using globalThis can help you set up or mock global variables and functions needed for your tests. This can be especially helpful when your tests need to run in different environments, such as during server-side rendering with Node.js or in a browser-like environment using a tool like Jest.
 * Using globalThis promotes better compatibility and reduces the risk of environment-specific issues, making your code more robust and easier to maintain. However, as with any global object, it's important to use it judiciously to avoid potential conflicts and to keep your code modular and maintainable.
 *
 * **/
globalThis.fetch = mockFetch;

describe('fetchData', () => {
  const BASE_URL = import.meta.env.VITE_OMDB_API_URL;

  afterEach(() => {
    vi.resetAllMocks(); // Reset mocks between tests
    cleanup(); // Cleanup any DOM elements created by tests
  });

  it('should return data for a valid query', async () => {
    const query = 'Inception';
    const mockResponse: FetchedMoviesResponse = {
      Response: 'True',
      Search: [
        {
          Title: 'Inception',
          Year: '2010',
          imdbID: 'tt1375666',
          Poster: 'N/A',
        },
      ],
      totalResults: 1,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchData<typeof mockResponse>(
      `${BASE_URL}s=${query}`
    );

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}s=${query}`, undefined);

    expect(result).toEqual({
      data: mockResponse,
      error: null,
    });
  });

  it('should handle errors when the response is not ok', async () => {
    const query = 'InvalidQuery';
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const result = await fetchData(`${BASE_URL}s=${query}`);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}s=${query}`, undefined);

    expect(result).toEqual({
      data: null,
      error: new Error('Error: 404 Not Found'),
    });
  });

  it('should handle network or other unexpected errors', async () => {
    const query = 'ErrorQuery';
    const mockError = new Error('Network Error');
    mockFetch.mockRejectedValueOnce(mockError);

    const result = await fetchData(`${BASE_URL}s=${query}`);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}s=${query}`, undefined);

    expect(result).toEqual({
      data: null,
      error: mockError,
    });
  });

  it('should send custom options when provided', async () => {
    const mockResponse = { id: 1, name: 'Test' };
    const options = { method: 'POST' };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchData<typeof mockResponse>(
      'https://example.com/api',
      options
    );

    expect(mockFetch).toHaveBeenCalledWith('https://example.com/api', options);
    expect(result).toEqual({
      data: mockResponse,
      error: null,
    });
  });
});
