import { type MovieData } from '../../../../customHooks/useMovies';

type MovieProps = {
  movie: MovieData;
  onSelectMovie: (movie: MovieData) => void;
}

const Movie = ({ movie, onSelectMovie }: MovieProps) => {
  return (
    <li data-testid="movies-list" onClick={() => onSelectMovie(movie)} key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
};

export default Movie;
