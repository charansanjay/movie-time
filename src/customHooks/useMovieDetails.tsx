import { useEffect, useState } from "react";
import { fetchData } from "../utils/networkRequests";

export type FetchedMovieDetailsResponse = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: {
    Source: string;
    Value: string;
  }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export type MovieDetails = {
  Title: string,
  Year: string,
  Poster: string,
  Runtime: string,
  imdbRating: string,
  Plot: string,
  Released: string,
  Actors: string,
  Director: string,
  Genre: string,
  Writer: string,
}

export const useMovieDetails = (url: string, selectedMovieId: string) => {

  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null)
  const [isMovieDetailsLoading, setIsMovieDetailsLoading] = useState<boolean>(false)
  const [fetchMovieDetailsError, setFetchMovieDetailsError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    setIsMovieDetailsLoading(true);
    setFetchMovieDetailsError(null);

    const fetchMovieDetails = async () => {
      const { data, error } = await fetchData<FetchedMovieDetailsResponse>(`${url}i=${selectedMovieId}`, {
        signal: controller.signal,
      });

      console.log(data);

      if (isMounted) {
        if (error && error.message !== 'AbortError') {
          setFetchMovieDetailsError(error);
        } else {
          setMovieDetails(data);
        }
      }

      setIsMovieDetailsLoading(false);
    };

    if (selectedMovieId) {
      fetchMovieDetails();
    } else {
      setMovieDetails(null);
      setIsMovieDetailsLoading(false);
      setFetchMovieDetailsError(null);
    }

  }, [selectedMovieId])

  return { movieDetails, isMovieDetailsLoading, fetchMovieDetailsError };

}