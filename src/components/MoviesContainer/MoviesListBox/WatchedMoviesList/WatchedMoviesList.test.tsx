import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import "@testing-library/jest-dom";

import { type WatchedData } from '../../../../App.tsx';
import WatchedMoviesList from './WatchedMoviesList.tsx';

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

describe("WatchedMoviesList Component", () => {
  const mockOnDeleteWatched = vi.fn();

  it("should render the component without crashing", () => {
    // Arrange: Render the WatchedMovieList Component
    render(<WatchedMoviesList watched={watchedMovies} onDeleteWatched={mockOnDeleteWatched} />)

    // Assert: Check if all movie titles are rendered
    watchedMovies.forEach(movie => {
      expect(screen.getByText(movie.Title)).toBeInTheDocument();
    });
  });

  it("should render empty list when no movies are passed", () => {
    // Arrange: Render the WatchedMovieList Component
    render(<WatchedMoviesList watched={[]} onDeleteWatched={mockOnDeleteWatched} />);

    // Assert: Ensure no movie list items are rendered
    const movieItems = screen.queryAllByRole('listitem')
    expect(movieItems).toHaveLength(0);
  });

  // Integration test with WatchedMovie
  it("should call onDeleteWatched with a correct movie when a movie is clicked", () => {
    // Arrange: Render the WatchedMovieList Component
    render(<WatchedMoviesList watched={watchedMovies} onDeleteWatched={mockOnDeleteWatched} />);

    // Act: Simulate clicking on the delete button for the first movie
    const firstDeleteButton = screen.getAllByRole("img", { name: /close-icon/i })[0];
    fireEvent.click(firstDeleteButton)

    expect(mockOnDeleteWatched).toBeCalledWith(watchedMovies[0].imdbID);
    expect(mockOnDeleteWatched).toBeCalledTimes(1);
  })

})


