import './numResults.css';
import { type MovieData } from '../../../customHooks/useMovies';

const NumResults = ({ movies }: { movies: MovieData[] }) => {
  return (
    <p className='num-results'>
      Found <strong>{movies?.length ?? 0}</strong> results
    </p>
  );
};

export default NumResults;
