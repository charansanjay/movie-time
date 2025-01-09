import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import "@testing-library/jest-dom";

import Movie from './Movie.tsx';
import { type MovieData } from '../../../../customHooks/useMovies';

// Prepare Dummy Data for testing
const movie: MovieData = { imdbID: '1', Title: 'Movie 1', Year: '2021', Poster: 'N/A' }

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

describe("Movie Component", () => {
  // Create mock functions for function props
  const mockOnSelectMovie = vi.fn();

  it("should render the component without crashing", () => {

    // Act: render the comonent
    render(<Movie movie={movie} onSelectMovie={mockOnSelectMovie} />)

    // Assert: Check if the movie is rendered
    expect(screen.getByText(movie.Title)).toBeInTheDocument()
  });

  it('should render the movie title and year', () => {
    // Act: Render the Movie component with test data
    render(<Movie movie={movie} onSelectMovie={mockOnSelectMovie} />);

    // Assert: Ensure the movie title and year are rendered
    expect(screen.getByText(movie.Title)).toBeInTheDocument();
    expect(screen.getByText(movie.Year)).toBeInTheDocument();
  });

  it("should call onSelectMovie when the movie is clicked", () => {
    // Act: Render the Movie component with test data
    render(<Movie movie={movie} onSelectMovie={mockOnSelectMovie} />);

    // Simulate a click on the movie item
    const movieItem = screen.getByText(movie.Title);
    fireEvent.click(movieItem);

    // Assert: Ensure onSelectMovie is called with the correct movie
    expect(mockOnSelectMovie).toHaveBeenCalledWith(movie);
    expect(mockOnSelectMovie).toHaveBeenCalledTimes(1);
  });

  it("should display the correct image alt text", () => {
    // Act: Render the Movie component with test data
    render(<Movie movie={movie} onSelectMovie={mockOnSelectMovie} />);

    // Assert: Ensure the image alt text matches the movie title
    const image = screen.getByAltText(`${movie.Title} poster`);
    expect(image).toBeInTheDocument();
  });

  it("should points the src or the image to the correct url", () => {
    // Act: Render the Movie component with test data
    render(<Movie movie={movie} onSelectMovie={mockOnSelectMovie} />);

    // Assert: Ensure the image alt text matches the movie title
    const image = screen.getByAltText(`${movie.Title} poster`);
    expect(image).toHaveAttribute("src", movie.Poster)
  })
})