import { useEffect, useState } from 'react';
import { fetchData } from '../utils/networkRequests';

export type MovieData = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
};

export type FetchedMoviesResponse = {
  Response: string;
  Search: MovieData[];
  totalResults: number;
  Error?: string;
};

export const useMovies = (url: string, query: string) => {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [isMoviesLoading, setIsMoviesLoading] = useState<boolean>(false);
  const [fetchMoviesError, setFetchMoviesError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    setIsMoviesLoading(true);
    setFetchMoviesError(null);

    const fetchMovies = async () => {
      const { data, error } = await fetchData<FetchedMoviesResponse>(
        `${url}s=${query}`,
        {
          signal: controller.signal,
        }
      );

      //! Important
      /* The "isMounted" flag ensures that state updates are only performed 
      when the component is still active, avoiding unnecessary updates 
      caused by Strict Mode's unmount/mount simulation.
      */
      if (isMounted) {
        if (error && error.message !== 'AbortError') {
          setFetchMoviesError(error);
        } else if (data?.Search) {
          setMovies(data.Search);
        } else if (data?.Response === 'False') {
          setFetchMoviesError(new Error(data.Error));
        }
      }

      setIsMoviesLoading(false);
    };

    // when nothing is types in the search.
    if (!query.length || query.length <= 2) {
      setIsMoviesLoading(false);
      setMovies([]);
      setFetchMoviesError(null);
      return;
    }

    fetchMovies();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [url, query]);

  return { movies, isMoviesLoading, fetchMoviesError };
};
