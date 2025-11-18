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

export default async function fetchMovies (query: string): Promise<MovieResponse> {
    const response = await axios.get<MovieResponse>(`${BASE_URL}/search/movie`, {
  params: {
    query: query
  },
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  }
    })
    return response.data;
}