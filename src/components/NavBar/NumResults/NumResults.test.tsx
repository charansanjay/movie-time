import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import "@testing-library/jest-dom";

import NumResults from './NumResults.tsx';
import { type MovieData } from '../../../customHooks/useMovies.tsx';

afterEach(() => {
  cleanup();
})

describe("NumResults Component", () => {
  it("should render the component without crashing", () => {
    // Act: Render the NumResults component
    render(<NumResults movies={[]} />);


    // Use a function matcher to handle split text
    const numResultsElement = screen.getByText(/Found/i);

    // Assert: Check if the component is rendered
    expect(numResultsElement).toBeInTheDocument();
  })

  it("should display the correct number of results", () => {
    // Arrange: Prepare the test data
    const movies: MovieData[] = [
      {
        Title: "Movie 1",
        Year: "2021",
        imdbID: "1",
        Poster: "N/A"
      },
      {
        Title: "Movie 2",
        Year: "2022",
        imdbID: "2",
        Poster: "N/A"
      },
      {
        Title: "Movie 3",
        Year: "2023",
        imdbID: "3",
        Poster: "N/A"
      }
    ];

    // Act: Render the NumResults component with the test data
    render(<NumResults movies={movies} />);

    // Assert: Check if the correct number of results is displayed
    const numResultsElement = screen.getByText(movies.length);
    expect(numResultsElement).toBeInTheDocument();
  })

  it('should handle undefined or null movies prop gracefully', () => {
    render(<NumResults movies={undefined as unknown as MovieData[]} />);
    const numResultsElement = screen.getByText(/0/i);
    expect(numResultsElement).toBeInTheDocument();
  });
})
