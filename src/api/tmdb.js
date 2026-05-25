// TMDB API integration
// Free tier is generous; we still keep debounce + min-query-length guards at call sites.

const API_KEY  = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Image bases — TMDB poster_path / backdrop_path values already start with a leading slash.
export const IMG_URL      = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

async function tmdbFetch(path, signal) {
  const sep = path.includes('?') ? '&' : '?';
  const url = `${BASE_URL}${path}${sep}api_key=${API_KEY}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.status_message || `Network error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * Search for movies by title keyword.
 * @param {string} query - The search term (must be at least 2 characters).
 * @param {AbortSignal} [signal] - Optional AbortController signal for cancellation.
 * @param {number} [page=1] - 1-indexed page; TMDB returns 20 results per page.
 * @returns {Promise<Array>} Array of TMDB movie objects from the results field.
 */
export async function searchMovies(query, signal, page = 1) {
  const path = `/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`;
  const data = await tmdbFetch(path, signal);
  return data.results ?? [];
}

/**
 * Fetch full details for a single movie by TMDB id, plus cast & crew.
 * Uses append_to_response=credits to avoid a second roundtrip.
 * @param {string|number} id - TMDB numeric id.
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>}
 */
export async function getMovieDetails(id, signal) {
  const path = `/movie/${encodeURIComponent(id)}?append_to_response=credits,videos&language=en-US`;
  return tmdbFetch(path, signal);
}

/**
 * Trending movies for use in the hero slider / "what's hot" rails.
 * @param {'day'|'week'} [timeWindow='week']
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array>}
 */
export async function getTrending(timeWindow = 'week', signal) {
  const path = `/trending/movie/${timeWindow}?language=en-US`;
  const data = await tmdbFetch(path, signal);
  return data.results ?? [];
}

/**
 * Popular movies — TMDB's "popular" feed (page-able).
 * @param {number} [page=1]
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array>}
 */
export async function getPopular(page = 1, signal) {
  const path = `/movie/popular?language=en-US&page=${page}`;
  const data = await tmdbFetch(path, signal);
  return data.results ?? [];
}

/**
 * Paginated variant of getPopular — returns the full TMDB page envelope so the
 * caller can build a "Load More" UI without losing total_pages.
 * @param {number} [page=1]
 * @param {AbortSignal} [signal]
 * @returns {Promise<{results: Array, page: number, total_pages: number, total_results: number}>}
 */
export async function getPopularPaged(page = 1, signal) {
  const path = `/movie/popular?language=en-US&page=${page}`;
  const data = await tmdbFetch(path, signal);
  return {
    results: data.results ?? [],
    page: data.page ?? page,
    total_pages: data.total_pages ?? 1,
    total_results: data.total_results ?? 0,
  };
}

/**
 * Paginated variant of searchMovies — same shape as getPopularPaged.
 * @param {string} query
 * @param {number} [page=1]
 * @param {AbortSignal} [signal]
 */
export async function searchMoviesPaged(query, page = 1, signal) {
  const path = `/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`;
  const data = await tmdbFetch(path, signal);
  return {
    results: data.results ?? [],
    page: data.page ?? page,
    total_pages: data.total_pages ?? 1,
    total_results: data.total_results ?? 0,
  };
}
