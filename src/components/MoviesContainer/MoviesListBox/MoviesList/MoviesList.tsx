import Movie from './Movie';

import { type MovieData } from '../../../../customHooks/useMovies';

type MoviesListProps = {
  movies: MovieData[];
  onSelectMovie: (movie: MovieData) => void;
}

const MoviesList = ({ movies, onSelectMovie }: MoviesListProps) => {
  if (movies.length === 0) {
    return <p className='error'>No movies available</p>; // Or return null if you want nothing to be rendered
  }
  return (
    <ul className='list list-movies'>
      {movies?.map((movie) => (
        <Movie onSelectMovie={onSelectMovie} movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
};

export default MoviesList;
