import Loader from '../../../Loader/Loader';
import { useMovieDetails } from '../../../../customHooks/useMovieDetails';
import StarRating from '../../../StarRating/StarRating';
import { useState, useMemo } from 'react';
import { WatchedData } from '../../../../App';
import closeIcon from '../../../../images/close_icon.svg';

type MovieDetailsProps = {
  selectedMovieId: string; // ID of the selected movie
  watched: WatchedData[]; // Array of movies that the user has watched
  onCloseMovie: () => void; // Function to handle closing the movie details
  onAddWatched: (movie: WatchedData) => void; // Function to handle adding a movie to the watched list
};

const url = import.meta.env.VITE_BASE_URL; // Base URL for API calls

const MovieDetails = ({
  selectedMovieId,
  watched,
  onCloseMovie,
  onAddWatched,
}: MovieDetailsProps) => {
  // State to store the user's rating for the movie
  const [userRating, setUserRating] = useState<number>(0);

  // Custom hook to fetch movie details based on selected movie ID
  const { movieDetails, isMovieDetailsLoading, fetchMovieDetailsError } =
    useMovieDetails(url, selectedMovieId);

  // Destructuring movieDetails with default values for better type safety from undefined properties
  const {
    Title: title = 'Unknown Title',
    Year: year = 'N/A',
    Poster: poster = '',
    Runtime: runtime = 'N/A',
    imdbRating = 'N/A',
    Plot: plot = 'No description available.',
    Released: released = 'N/A',
    Actors: actors = 'Unknown',
    Director: director = 'Unknown',
    Genre: genre = 'Unknown',
  } = movieDetails || {};

  /* Memoize isWatched and watchedUserRating to prevent unnecessary recalculations on re-renders. */
  // The calculation for isWatched is re-evaluated on every render. Optimize this using useMemo to avoid unnecessary recalculations
  const isWatched = useMemo(
    () => watched.some((movie) => movie.imdbID === selectedMovieId),
    [watched, selectedMovieId]
  );

  // Memoized calculation to get the user rating for the selected movie from the watched list
  const watchedUserRating = useMemo(
    () => watched.find((movie) => movie.imdbID === selectedMovieId)?.userRating,
    [watched, selectedMovieId]
  );

  // Handles adding the movie to the watched list.
  const handleAdd = () => {
    if (!movieDetails || userRating === 0) return; // Prevent adding if movieDetails is undefined or rating is not set

    const newWatchedMovie: WatchedData = {
      imdbID: selectedMovieId,
      Title: title,
      Year: year,
      Poster: poster,
      runtime: runtime,
      imdbRating: Number(imdbRating),
      userRating,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  };

  // If there's an error while fetching movie details, display the error message
  if (fetchMovieDetailsError) {
    return (
      <div className='details'>
        <p>Failed to load movie details. Please try again later.</p>
        <p>{fetchMovieDetailsError.message}</p>
      </div>
    );
  }

  // Render the star rating section or a message if already watched.
  const renderStarRating = () => {
    if (!isWatched) {
      return (
        <>
          <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
          {userRating > 0 && (
            <button
              data-testid='add-to-list'
              className={`btn-add ${userRating === 0 ? 'disabled' : ''}`}
              onClick={handleAdd}
              disabled={userRating === 0}
            >
              + Add to list
            </button>
          )}
        </>
      );
    }

    return (
      <p>
        You rated the movie with {watchedUserRating} <span>⭐️</span>
      </p>
    );
  };

  return (
    <div className='details'>
      {isMovieDetailsLoading ? ( // Display loader while fetching movie details
        <Loader />
      ) : (
        <>
          <header>
            <button className='btn-back' onClick={onCloseMovie}>
              <img title='Close details' alt='Close icon' src={closeIcon} />
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div data-testid="movie-details-overview" className='details-overview'>
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className='rating'>
              {renderStarRating()}
            </div>
            
            <p>
              <em>{plot}</em>
            </p>
            <p>
              <b>Starring:</b> {actors}
            </p>
            <p>
              <b>Directed by:</b> {director}
            </p>
          </section>
        </>
      )}
    </div>
  );
};

export default MovieDetails;
