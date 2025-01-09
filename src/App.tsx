import NavBar from './components/NavBar/NavBar';
import MoviesContainer from './components/MoviesContainer/MoviesContainer';
import MoviesListBox from './components/MoviesContainer/MoviesListBox/MoviesListBox';
import MoviesList from './components/MoviesContainer/MoviesListBox/MoviesList/MoviesList';
import { useEffect, useState } from 'react';
import WatchedMoviesSummary from './components/MoviesContainer/MoviesListBox/WatchedMoviesSummary/WatchedMoviesSummary';
import WatchedMoviesList from './components/MoviesContainer/MoviesListBox/WatchedMoviesList/WatchedMoviesList';
import Logo from './components/NavBar/Logo/Logo';
import Search from './components/NavBar/Search/Search';
import NumResults from './components/NavBar/NumResults/NumResults';
import Loader from './components/Loader/Loader';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import { useMovies, MovieData } from './customHooks/useMovies';
import MovieDetails from './components/MoviesContainer/MoviesListBox/MovieDetails/MovieDetails';
import { useLocalStorageState } from './customHooks/useLocalStorageState';

// Import environment variable for the API base URL
const url = import.meta.env.VITE_BASE_URL;

// Type definition for the structure of watched movie data
export type WatchedData = MovieData & {
  runtime: string;
  imdbRating: number;
  userRating: number;
};

function App() {
  // State variables

  const [query, setQuery] = useState<string>("");
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  // Custom hook that saparates the fetch logic for movies
  const { movies, isMoviesLoading, fetchMoviesError } = useMovies(
    url,
    query
  );
  // Custom hook that saves the watched movies to localStorage
  const [watched, setWatched] = useLocalStorageState<WatchedData[]>({
    initialState: [],
    key: 'watched'
  }) 
  
  /* Handlers */
  const handleSelectedMovie = (movie: MovieData) => {
    setSelectedMovieId((selectedMovieId) => movie.imdbID === selectedMovieId ? null : movie.imdbID);
  }

  const handleCloseMovie = () => {
    setSelectedMovieId(null);
  }

  const handleAddWatchedMovie = (movie: WatchedData) => {
    setWatched((watched) => [...watched, movie])
  }

  const handleDeleteWatchedMovie = (movieID: string) => {
    setWatched((watched) => watched.filter((watchedMovie) => watchedMovie.imdbID !== movieID));
  }

  /* Effects */
  // SideEffect that changes the document title to the selected movie title
  useEffect(() => {
    if (selectedMovieId) {
      document.title = `${movies.find((movie) => movie.imdbID === selectedMovieId)?.Title}`
    }

    return () => {
      document.title = `Movie Time`
    }
  }, [selectedMovieId]);

  // SideEffect that saves the watched movies to localStorage
  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched])

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <MoviesContainer>
        <MoviesListBox>
          {isMoviesLoading && <Loader />}
          {fetchMoviesError && (
            <ErrorMessage message={fetchMoviesError.message} />
          )}
          {!fetchMoviesError && !isMoviesLoading &&
            <MoviesList movies={movies} onSelectMovie={handleSelectedMovie} />
          }
        </MoviesListBox>

        <MoviesListBox>
          {selectedMovieId ? (
            <MovieDetails selectedMovieId={selectedMovieId} watched={watched} onCloseMovie={handleCloseMovie} onAddWatched={handleAddWatchedMovie} />
          ) : (<>
            <WatchedMoviesSummary watched={watched} />
            <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatchedMovie} />
          </>)}

        </MoviesListBox>
      </MoviesContainer>
    </>
  );
}

export default App;
