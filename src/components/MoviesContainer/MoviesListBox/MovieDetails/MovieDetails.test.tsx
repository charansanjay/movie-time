import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { it, expect, describe, vi, beforeEach, Mock, afterEach } from "vitest";
import "@testing-library/jest-dom";

import { type WatchedData } from '../../../../App';
import MovieDetails from "./MovieDetails.tsx";
import { useMovieDetails } from "../../../../customHooks/useMovieDetails.tsx";

// Mock for the custom hook
vi.mock('../../../../customHooks/useMovieDetails.tsx', () => (
  {
    useMovieDetails: vi.fn(),
  }
))

// Mock the star component
vi.mock("../../../StarRating/StarRating.tsx", () => (
  {
    __esModule: true,
    default: ({ onSetRating }: { onSetRating: (rating: number) => void }) => (
      <div onClick={() => onSetRating(5)} >Star Rating</div>
    )
  }
))

// Mock the Loader component
vi.mock('../../../Loader/Loader.tsx', () => ({
  __esModule: true,
  default: vi.fn().mockReturnValue(<div>Loader</div>),
}));

const mockedUseMovieDetails = useMovieDetails as Mock;

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

describe("MovieDetails Component", () => {
  // create Mocks for the function props
  const mockOncloseMovie = vi.fn();
  const mockOnAddWatched = vi.fn();
  const selectedMovieId = "123";
  const watched: WatchedData[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state when movie details are being fetched", () => {
    // Act: Call the mocked useMovieDetails Hook
    mockedUseMovieDetails.mockReturnValue({
      movieDetails: null,
      isMovieDetailsLoading: true,
      fetchMovieDetailsError: null,
    });

    render(
      <MovieDetails
        selectedMovieId={selectedMovieId}
        watched={watched}
        onCloseMovie={mockOncloseMovie}
        onAddWatched={mockOnAddWatched}
      />
    );

    // Assert: Check if the loading text is displayed in the document(component)
    // Ensure that the Loader component is rendered
    expect(screen.getByText('Loader')).toBeInTheDocument();
  });

  it("renders error message if fetching movie details fails", () => {
    const errorMessage = "Fetching movie details failed";
    mockedUseMovieDetails.mockReturnValue({
      movieDetails: null,
      isMovieDetailsLoading: false,
      fetchMovieDetailsError: new Error(errorMessage),
    });

    render(
      <MovieDetails
        selectedMovieId={selectedMovieId}
        watched={watched}
        onCloseMovie={mockOncloseMovie}
        onAddWatched={mockOnAddWatched}
      />
    );

    // Assert: Check if the error message text is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("displays movie details when data is fetched successfully", () => {
    // Arrange: Create dummy mock response to simulate movie details
    const mockedMovieDetails = {
      Title: "Test Movie",
      Year: "2025",
      Poster: "poster.jpg",
      Runtime: "120 min",
      imdbRating: "7.5",
      Plot: "This is a test plot.",
      Released: "2025-01-01",
      Actors: "Actor A, Actor B",
      Director: "Director A",
      Genre: "Action",
    };

    // Act: Call the mocked useMovieDetails Hook
    mockedUseMovieDetails.mockReturnValue({
      movieDetails: mockedMovieDetails,
      isMovieDetailsLoading: null,
      fetchMovieDetailsError: null,
    });

    // render the component
    render(
      <MovieDetails
        selectedMovieId={selectedMovieId}
        watched={watched}
        onCloseMovie={mockOncloseMovie}
        onAddWatched={mockOnAddWatched}
      />
    );

    // Assert: Ensure the movie title is displayed
    expect(screen.getByText(mockedMovieDetails.Title)).toBeInTheDocument();
    /* To handle cases where the text is split by multiple elements or characters, 
    you can use a regular expression with getByText */
    expect(screen.getByText(new RegExp(`${mockedMovieDetails.Released}`))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${mockedMovieDetails.Runtime}`))).toBeInTheDocument();
    expect(screen.getByText(mockedMovieDetails.Plot)).toBeInTheDocument();
    expect(screen.getByText(mockedMovieDetails.Actors)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${(mockedMovieDetails.imdbRating)}`))).toBeInTheDocument();
  });

  it("should enable 'Add to list' button when userRating is greater than 0", () => {
    const mockedMovieDetails = {
      Title: "Test Movie",
      Year: "2025",
      Poster: "poster.jpg",
      Runtime: "120 min",
      imdbRating: "7.5",
      Plot: "This is a test plot.",
      Released: "2025-01-01",
      Actors: "Actor A, Actor B",
      Director: "Director A",
      Genre: "Action",
    };

    mockedUseMovieDetails.mockReturnValue({
      movieDetails: mockedMovieDetails,
      isMovieDetailsLoading: null,
      fetchMovieDetailsError: null,
    });

    render(
      <MovieDetails
        selectedMovieId={selectedMovieId}
        watched={watched}
        onCloseMovie={mockOncloseMovie}
        onAddWatched={mockOnAddWatched}
      />
    );


    // Simulate setting the user rating to greater than 0
    fireEvent.click(screen.getByText("Star Rating"));

    // Ensure "Add to list" button is in the document
    expect(screen.getByText("+ Add to list")).toBeInTheDocument();
  });

  it("should add movie to watched list when 'Add to list' button is clicked", () => {
    const mockedMovieDetails = {
      Title: "Test Movie",
      Year: "2025",
      Poster: "poster.jpg",
      Runtime: "120 min",
      imdbRating: "7.5",
      Plot: "This is a test plot.",
      Released: "2025-01-01",
      Actors: "Actor A, Actor B",
      Director: "Director A",
      Genre: "Action",
    };

    mockedUseMovieDetails.mockReturnValue({
      movieDetails: mockedMovieDetails,
      isMovieDetailsLoading: null,
      fetchMovieDetailsError: null,
    });

    render(
      <MovieDetails
        selectedMovieId={selectedMovieId}
        watched={watched}
        onCloseMovie={mockOncloseMovie}
        onAddWatched={mockOnAddWatched}
      />
    );

    // Simulate setting the user rating to greater than 0
    fireEvent.click(screen.getByText("Star Rating"));

    const addButton = screen.getByText("+ Add to list")
    fireEvent.click(addButton);

    expect(mockOnAddWatched).toHaveBeenCalledWith({
      imdbID: selectedMovieId,
      Title: mockedMovieDetails.Title,
      Year: mockedMovieDetails.Year,
      Poster: mockedMovieDetails.Poster,
      runtime: mockedMovieDetails.Runtime,
      imdbRating: Number(mockedMovieDetails.imdbRating),
      userRating: 5,
    });

    expect(mockOncloseMovie).toHaveBeenCalled();
  });

  it("should call onCloseMovie when close button is clicked", () => {
    const mockedMovieDetails = {
      Title: "Test Movie",
      Year: "2025",
      Poster: "poster.jpg",
      Runtime: "120 min",
      imdbRating: "7.5",
      Plot: "This is a test plot.",
      Released: "2025-01-01",
      Actors: "Actor A, Actor B",
      Director: "Director A",
      Genre: "Action",
    };

    mockedUseMovieDetails.mockReturnValue({
      movieDetails: mockedMovieDetails,
      isMovieDetailsLoading: null,
      fetchMovieDetailsError: null,
    });

    render(
      <MovieDetails
        selectedMovieId={selectedMovieId}
        watched={watched}
        onCloseMovie={mockOncloseMovie}
        onAddWatched={mockOnAddWatched}
      />
    );

    fireEvent.click(screen.getByTitle("Close details"));
    expect(mockOncloseMovie).toHaveBeenCalled();
  });

  it("should display the message if Movie is available in watched list", () => {
    const watchedMovies: WatchedData[] = [
      {
        imdbID: selectedMovieId,
        Title: "Test Movie",
        Year: "2025",
        Poster: "poster.jpg",
        runtime: "120 min",
        imdbRating: 7.5,
        userRating: 5,
      },
    ];

    const mockedMovieDetails = {
      Title: "Test Movie",
      Year: "2025",
      Poster: "poster.jpg",
      Runtime: "120 min",
      imdbRating: "7.5",
      Plot: "This is a test plot.",
      Released: "2025-01-01",
      Actors: "Actor A, Actor B",
      Director: "Director A",
      Genre: "Action",
    };

    mockedUseMovieDetails.mockReturnValue({
      movieDetails: mockedMovieDetails,
      isMovieDetailsLoading: null,
      fetchMovieDetailsError: null,
    });

    render(
      <MovieDetails
        selectedMovieId={selectedMovieId}
        watched={watchedMovies}
        onCloseMovie={mockOncloseMovie}
        onAddWatched={mockOnAddWatched}
      />
    );

    expect(screen.getByText(`You rated the movie with ${watchedMovies[0].userRating}`)).toBeInTheDocument();
  })
});
