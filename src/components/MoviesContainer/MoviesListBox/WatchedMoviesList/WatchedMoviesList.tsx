import { WatchedData } from '../../../../App';
import WatchedMovie from './WatchedMovie';

const WatchedMoviesList = ({
  watched,
  onDeleteWatched
}: {
  watched: WatchedData[];
  onDeleteWatched: (imdbID: string) => void;
}) => {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
      ))}
    </ul>
  );
};

export default WatchedMoviesList;
