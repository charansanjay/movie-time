import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, Mock, afterEach, beforeEach } from 'vitest';
import "@testing-library/jest-dom";

import App, { type WatchedData } from './App.tsx';
import { MovieData, useMovies } from './customHooks/useMovies';
import { useLocalStorageState } from './customHooks/useLocalStorageState';
import { useMovieDetails } from './customHooks/useMovieDetails';

// Mock the star component
vi.mock("./components/StarRating/StarRating.tsx", () => (
  {
    __esModule: true,
    default: ({ onSetRating }: { onSetRating: (rating: number) => void }) => (
      <div onClick={() => onSetRating(5)} >Star Rating</div>
    )
  }
))

// Mock ErrorMessage Component
vi.mock("./components/ErrorMessage/ErrorMessage.tsx", () => {
  return {
    __esModule: true,
    default: ({ message }: { message: string }) => (
      <div>⛔ {message}</div>
    )
  }
})

// Mock Loader Component
vi.mock('./components/Loader/Loader.tsx', () => ({
  __esModule: true,
  default: vi.fn().mockReturnValue(<div>Loader</div>),
}));

// useMovies Mock
vi.mock('./customHooks/useMovies.tsx', () => {
  return {
    useMovies: vi.fn(),
  }
})

// useMovieDetails Mock
vi.mock('./customHooks/useMovieDetails.tsx', () => {
  return {
    useMovieDetails: vi.fn(),
  }
})

// useLocalStorageState Mock
vi.mock('./customHooks/useLocalStorageState.tsx', () => {
  return {
    useLocalStorageState: vi.fn(),
  }
});

const mockedUseMovies = useMovies as Mock;
const mockedUseMovieDetails = useMovieDetails as Mock;
const mockedUseLocalStorageState = useLocalStorageState as Mock;

describe('App Component', () => {

  const mockMovies: MovieData[] = [
    { imdbID: '1', Title: 'Movie 1', Year: '2021', Poster: 'poster1.jpg' },
    { imdbID: '2', Title: 'Movie 2', Year: '2022', Poster: 'poster2.jpg' },
    { imdbID: '3', Title: 'Movie 3', Year: '2023', Poster: 'poster3.jpg' },
  ]

  const mockWatched: WatchedData[] = [
    {
      imdbID: '1',
      Title: 'Movie 1',
      Year: '2021',
      Poster: 'poster1.jpg',
      runtime: '2h 30m',
      imdbRating: 8.5,
      userRating: 9,
    },
    {
      imdbID: '2',
      Title: 'Movie 2',
      Year: '2022',
      Poster: 'poster2.jpg',
      runtime: '120 min',
      imdbRating: 7.2,
      userRating: 8.1,
    }
  ];

  beforeEach(() => {
    mockedUseMovies.mockReturnValue({
      movies: mockMovies,
      isMoviesLoading: false,
      fetchMoviesError: null,
    });

    mockedUseLocalStorageState.mockReturnValue([mockWatched, vi.fn()]);
  })

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders NavBar with Logo, Search, and NumResults', () => {

    render(<App />);

    expect(screen.getByText(/Movie Time/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search.../i)).toBeInTheDocument();
    expect(screen.getByText("Found results")).toBeInTheDocument();
  });

  it('renders MoviesList with movies', () => {

    render(<App />);
    // Debug the DOM to see where the duplicate titles are coming from
    screen.debug();
    expect(screen.getAllByText(mockMovies[0].Title)[0]).toBeInTheDocument();
    expect(screen.getAllByText(mockMovies[1].Title)[0]).toBeInTheDocument();
    expect(screen.getAllByText(mockMovies[2].Title)[0]).toBeInTheDocument();
  });

  it("should render loading state when movies are still fetching", () => {

    mockedUseMovies.mockReturnValue({
      movies: null,
      isMoviesLoading: true,
      fetchMoviesError: null,
    });

    render(<App />);

    expect(screen.getByText(/Loader/i)).toBeInTheDocument();
  })

  it("should diaplay Error message when movies fail to fetch", () => {
    const errorMessage = "Failed to fetch movies";
    mockedUseMovies.mockReturnValue({
      movies: null,
      isMoviesLoading: false,
      fetchMoviesError: new Error(errorMessage),
    });

    render(<App />);

    expect(screen.getByText(`⛔ ${errorMessage}`)).toBeInTheDocument();
  })

  it('handles movie selection and updates document title', async () => {

    const mockedMovieDetails = {
      Title: 'Movie 1',
      Year: '2021',
      Poster: 'poster1.jpg',
      Runtime: '1h 45m',
      imdbRating: "6.8",
      Plot: "This is a test plot.",
      Released: "2021-01-01",
      Actors: "Actor A, Actor B",
      Director: "Director A",
      Genre: "Action",
    };

    mockedUseMovieDetails.mockReturnValue({
      movieDetails: mockedMovieDetails,
      isMovieDetailsLoading: false,
      fetchMovieDetailsError: null,
    });

    render(<App />);

    const movie = screen.getAllByTestId("movies-list")[0];
    fireEvent.click(movie);

    // Assert: Ensure the document titlle is updated to the selected movie
    await waitFor(() => expect(document.title).toBe(mockMovies[0].Title))
  });

  it('renders WatchedMoviesSummary and WatchedMoviesList', () => {

    render(<App />);

    expect(screen.getByText(/Movies you watched/i)).toBeInTheDocument();
    expect(screen.getAllByText(mockMovies[0].Title)[0]).toBeInTheDocument();
  });

  it('handles closing movie details and resets document title', async () => {

    const mockedMovieDetails = {
      Title: 'Movie 1',
      Year: '2021',
      Poster: 'poster1.jpg',
      Runtime: '1h 45m',
      imdbRating: "6.8",
      Plot: "This is a test plot.",
      Released: "2021-01-01",
      Actors: "Actor A, Actor B",
      Director: "Director A",
      Genre: "Action",
    };

    mockedUseMovieDetails.mockReturnValue({
      movieDetails: mockedMovieDetails,
      isMovieDetailsLoading: false,
      fetchMovieDetailsError: null,
    });

    render(<App />);

    // Select a movie by click
    const movie = screen.getAllByTestId("movies-list")[0];
    fireEvent.click(movie);

    // Ensure movieDetails is loaded correctly
    expect(screen.getByTestId("movie-details-overview")).toHaveTextContent(mockedMovieDetails.Title);

    // Wait for the close button to be in the document
    expect(screen.getByAltText('Close icon')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Close details'));

    // Assert
    expect(document.title).toBe('Movie Time');
  });

  it('handles adding a movie to watched list', async () => {
    let watchedState = [...mockWatched]; // Initialize the local state for watched movies
    const setWatched = vi.fn((updater) => {
      watchedState = typeof updater === 'function' ? updater(watchedState) : updater;
    });

    mockedUseLocalStorageState.mockReturnValue([watchedState, setWatched]);

    const mockedMovieDetails = {
      Title: 'Movie 3',
      Year: '2025',
      Poster: 'poster3.jpg',
      Runtime: '1h 45m',
      imdbRating: "6.8",
      Plot: "This is a test plot.",
      Released: "2025-01-01",
      Actors: "Actor A, Actor B",
      Director: "Director A",
      Genre: "Action",
    };

    mockedUseMovieDetails.mockReturnValue({
      movieDetails: mockedMovieDetails,
      isMovieDetailsLoading: false,
      fetchMovieDetailsError: null,
    });

    const { rerender } = render(<App />);

    // Select a movie by clicking on it
    const movie = screen.getAllByTestId("movies-list")[2];
    fireEvent.click(movie);

    // Wait for the MovieDetails to appear in the document
    // Ensure movieDetails is loaded correctly
    await waitFor(() => expect(screen.getByTestId("movie-details-overview")).toHaveTextContent(mockedMovieDetails.Title));

    // Rate the movie
    fireEvent.click(screen.getByText("Star Rating"));

    // Ensure "Add to list" button is in the document
    await waitFor(() => expect(screen.getByText("+ Add to list")).toBeInTheDocument());

    // Click the "Add to list" button
    fireEvent.click(screen.getByText("+ Add to list"));

    // Simulate the re-render after state update
    mockedUseLocalStorageState.mockReturnValue([watchedState, setWatched]);
    rerender(<App />);

    // add new movie is added to the mockWatched list
    expect(watchedState).toEqual([
      ...mockWatched,
      expect.objectContaining({
        imdbID: mockMovies[2].imdbID,
        Title: mockedMovieDetails.Title,
        Year: mockedMovieDetails.Year,
        Poster: mockedMovieDetails.Poster,
        runtime: mockedMovieDetails.Runtime,
        imdbRating: Number(mockedMovieDetails.imdbRating),
        userRating: 5, // Assuming the user rating is set to 5 in the test
      }),
    ]);

    // Ensure setWatched is called with an updater function
    expect(setWatched).toHaveBeenCalledWith(expect.any(Function));

    // check if the movie is added to the DOM
    expect(screen.getAllByTestId("watched-movie")).toHaveLength(3);
    expect(screen.getAllByTestId("watched-movie")[2]).toHaveTextContent(mockMovies[2].Title);

    // Ensure setWatched is called once
    expect(setWatched).toHaveBeenCalledTimes(1);
  });

  it("should delete movie", async () => {
    /** When you call setWatched, the DOM is not automatically updated since you are mocking state management 
     * and React's rendering behavior is bypassed.
     * 
     * Instead of mocking setWatched as a simple function, 
     * simulate the behavior of React's useState by updating the state and re-rendering the component.
    **/
    // Use a variable to simulate React's state for watched movies
    let watchedState = [...mockWatched];

    /* React state updates are asynchronous and trigger re-renders automatically. 
    Since you are mocking setWatched, you must manually update the watchedState variable 
    and mock its behavior to mimic React's useState. 
    */
    const setWatched = vi.fn((updater) => {
      watchedState = typeof updater === 'function' ? updater(watchedState) : updater;
    });

    mockedUseLocalStorageState.mockReturnValue([watchedState, setWatched]);

    const { rerender } = render(<App />);

    // Ensure the watched movies are rendered
    expect(screen.getAllByTestId("watched-movie")).toHaveLength(2);
    expect(screen.getAllByTestId("watched-movie")[0]).toHaveTextContent(mockWatched[0].Title);

    // Click the delete button of the first watched movie
    const deleteButton = screen.getAllByTestId("delete-button")[0];
    fireEvent.click(deleteButton);

    // Simulate the re-render after state update
    mockedUseLocalStorageState.mockReturnValue([watchedState, setWatched]);
    rerender(<App />);

    screen.debug();

    // Ensure the first watched movie is removed
    expect(watchedState).toEqual(mockWatched.slice(1));

    // Ensure setWatched is called with the correct arguments
    expect(setWatched).toHaveBeenCalledWith(expect.any(Function));

    // check if the movie is removed from the DOM
    expect(screen.getAllByTestId("watched-movie")).toHaveLength(1);
    expect(screen.getAllByTestId("watched-movie")[0]).toHaveTextContent(mockWatched[1].Title);

    expect(setWatched).toHaveBeenCalledTimes(1);
  });
});