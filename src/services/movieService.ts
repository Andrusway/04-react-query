import type { Movie } from "../types/movie";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export default async function fetchMovies (query: string, page: number): Promise<MovieResponse> {
    const response = await axios.get<MovieResponse>(`${BASE_URL}/search/movie`, {
  params: {
    query,
    page,
  },
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  }
    })
    return response.data;
}







// export default async function fetchMovies (id: number)  {
//     // const response = await axios.get<MovieResponse>(`${BASE_URL}/search/movie`)
//     // const response = await axios.get<MovieResponse>(`https://swapi.info/api/people/${id}`)

  
//     return response.data;

// }