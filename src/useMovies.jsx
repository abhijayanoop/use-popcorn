import { useState, useEffect } from "react";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const key = "2ecce1d5";

  useEffect(
    function () {
      //   callback?.();

      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            throw new Error("Something went wrong with fetching movies");
          }
          const data = await res.json();
          if (data.Response === "false") {
            throw new Error("Movie not found");
          }
          setMovies(data.Search);
          setError("");
        } catch (err) {
          console.log(err.message);
          if (error.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);

          return function () {
            controller.abort();
          };
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
    },
    [query]
  );

  return { movies, isLoading, error };
}
