import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import "@testing-library/jest-dom";

import MoviesList from './MoviesList.tsx';
import { type MovieData } from '../../../../customHooks/useMovies.tsx';


// Prepare Dummy Data for testing
const movies: MovieData[] = [
  { Title: 'Movie 1', Year: '2021', imdbID: '1', Poster: 'N/A' },
  { Title: 'Movie 2', Year: '2022', imdbID: '2', Poster: 'N/A' },
  { Title: 'Movie 3', Year: '2023', imdbID: '3', Poster: 'N/A' },
]

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

describe("MoviesList Component", () => {
  const mockOnSelectMovie = vi.fn()

  it("should render the component without crashing", () => {
    // Arrange: Render the MoviesList component
    render(<MoviesList movies={movies} onSelectMovie={mockOnSelectMovie} />);

    // Assert: Check if all movie titles are rendered
    movies.forEach(movie => {
      expect(screen.getByText(movie.Title)).toBeInTheDocument();
    })
  })

  it('should call onSelectMovie with a correct movie when a movie is clicked', () => {
    // Arrange: Render the MoviesList component
    render(<MoviesList movies={movies} onSelectMovie={mockOnSelectMovie} />);

    // Act: Simulate clicking on the first movie
    const firstMovie = screen.getByText(/Movie 1/i);
    fireEvent.click(firstMovie);

    // Assert: Ensure onSelectMovie is called with the correct movie
    expect(mockOnSelectMovie).toBeCalledWith(movies[0]);
    expect(mockOnSelectMovie).toBeCalledTimes(1);
  })

  it("should render empty list when no movies are passed", () => {
    // Arrange: Render the MoviesList component with an empty movie array
    render(<MoviesList movies={[]} onSelectMovie={mockOnSelectMovie} />);

    // Assert: Ensure no movie list items are rendered
    const movieItems = screen.queryAllByRole('listitem')
    expect(movieItems).toHaveLength(0);
  })
})