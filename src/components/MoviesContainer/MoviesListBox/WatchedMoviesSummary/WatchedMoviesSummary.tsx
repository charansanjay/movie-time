import { WatchedData } from '../../../../App';
import { average, calcAvgRunTime, parseRuntime } from '../../../../utils/calculate';

const WatchedMoviesSummary = ({
  watched,
}: {
  watched: WatchedData[];
}) => {

  const avgImdbRating: number = average(
    watched.map((movie) => movie.imdbRating)
  );
  const avgUserRating: number = average(
    watched.map((movie) => movie.userRating)
  );

  const avgRuntime: number =
    watched.length > 0
      ? calcAvgRunTime(watched.map((movie) => parseRuntime(movie.runtime)))
      : 0;

  return (
    <div className='summary'>
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
};

export default WatchedMoviesSummary;
