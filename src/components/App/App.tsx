import css from "./App.module.css";
import { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import fetchMovies from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import {useQuery, keepPreviousData} from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';





export default function App() {
  const [film, setFilms] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState<number>(1);

  const { data, isError, isLoading, error, isSuccess } = useQuery({
    queryKey: ["movies", film, page],
    queryFn: () => fetchMovies(film, page),
    enabled: film !== "",
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data]);

  const handleSubmit = async (query: string) => {
    if (!query) return;
    setFilms(query);
    setPage(1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSubmit} />
      {isLoading && <Loader />}
      {isSuccess && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isSuccess && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
      )}
      {isSuccess && data.results.length === 0 && <ErrorMessage />}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}






//   const [state, setState] = useState<number>(0);

// const {data, isError, isLoading} = useQuery({
//   queryKey: ["film", state],
//   queryFn: () => fetchMovies(state),
//   enabled: state > 0,
//   staleTime: 1000 * 60 * 5, // 5 minutes
// })

// console.log({data, isError, isLoading});

// return (
//   <div>
//     <button onClick={() => setState(prev => prev + 1)}>+</button>
//     <span>{state}</span>
//     <button onClick={() => setState(prev => prev - 1)}>-</button>

//     <pre>{JSON.stringify(data, null, 4)}</pre>
    
//   </div>
// )