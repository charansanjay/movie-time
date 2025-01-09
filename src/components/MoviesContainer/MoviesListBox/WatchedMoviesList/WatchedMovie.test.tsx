import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import "@testing-library/jest-dom";

import { type WatchedData } from '../../../../App.tsx';
import WatchedMovie from './WatchedMovie.tsx';

// Prepare Dummy Data for testing
const watchedMovies: WatchedData[] = [
  {
    imdbID: '1',
    Title: "Test Movie 1",
    Year: "2025",
    Poster: "poster.jpg",
    runtime: "120 min",
    imdbRating: 7.5,
    userRating: 7,
  },
  {
    imdbID: '2',
    Title: "Test Movie 2",
    Year: "2025",
    Poster: "poster.jpg",
    runtime: "120 min",
    imdbRating: 6.5,
    userRating: 6,
  },
  {
    imdbID: '',
    Title: "Test Movie 3",
    Year: "2025",
    Poster: "poster.jpg",
    runtime: "120 min",
    imdbRating: 3.5,
    userRating: 3,
  }
];

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

describe("WatchedMovie Component", () => {
  const mockOnDeleteWatched = vi.fn();

  it("should render the component without crashing", () => {
    // Arrange: Render the WatchedMovie Component
    render(<WatchedMovie movie={watchedMovies[0]} onDeleteWatched={mockOnDeleteWatched} />)

    // Assert: Check if all movie titles are rendered
    expect(screen.getByText(watchedMovies[0].Title)).toBeInTheDocument();
  });

  it("should call onDeleteWatched with a correct movie when delete button is clicked", () => {
    // Arrange: Render the WatchedMovie Component
    render(<WatchedMovie movie={watchedMovies[0]} onDeleteWatched={mockOnDeleteWatched} />)

    // Act: Simulate clicking on the delete button
    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    // Assert: Ensure onDeleteWatched is called with the correct movie
    expect(mockOnDeleteWatched).toBeCalledWith(watchedMovies[0].imdbID);
    expect(mockOnDeleteWatched).toBeCalledTimes(1);
  });
});