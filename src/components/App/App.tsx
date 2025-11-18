import css from "./App.module.css";
import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import fetchMovies from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";





export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSubmit = async (query: string) => {
    if (!query) return;

    setMovies([]);
    setIsLoading(true);
    setHasSearched(true);

    try {
      const data = await fetchMovies(query)

      if (data.results.length === 0) {
        toast.error("No movies found for your request.")
      } else {
        setMovies(data.results)
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      console.error(error);
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie)
  }

  const handleCloseModal = () => {
  setSelectedMovie(null);
}

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSubmit} />
      {movies.length >0 && <MovieGrid movies={movies} onSelect={handleSelectMovie} />}
      {isLoading && <Loader />}
      {hasSearched && !isLoading && movies.length === 0 && <ErrorMessage />}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
    </div>
  );
}
