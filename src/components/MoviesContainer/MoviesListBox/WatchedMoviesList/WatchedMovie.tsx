import { WatchedData } from '../../../../App';
import closeIcon from "../../../../images/close_icon.svg";

type WatchedMovieProps = {
  movie: WatchedData;
  onDeleteWatched: (imdbID: string) => void;
}

const WatchedMovie = ({ movie, onDeleteWatched }: WatchedMovieProps) => {
  return (
    <li data-testid="watched-movie" key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime}</span>
        </p>
        <button
          data-testid="delete-button"
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          <img alt="close-icon" src={closeIcon} />
        </button>
      </div>
    </li>
  );
};

export default WatchedMovie;
