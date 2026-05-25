// OMDb API integration
// Free tier limit: 1,000 requests/day — debounce + min-query-length guards are enforced at call sites.

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

/**
 * Search for movies by title keyword.
 * Uses the OMDb `s` (search) parameter; returns up to 10 results per page.
 * @param {string} query - The search term (must be at least 2 characters).
 * @param {AbortSignal} [signal] - Optional AbortController signal for cancellation.
 * @returns {Promise<Array>} Array of movie objects from the Search field.
 */
export async function searchMovies(query, signal) {
  const url = `${BASE_URL}?s=${encodeURIComponent(query)}&type=movie&apikey=${API_KEY}`;
  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new Error(`Network error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (data.Response === 'False') {
    // OMDb returns "Movie not found!" for empty results — treat that as an empty list,
    // but propagate real errors (e.g. "Invalid API key!", "Request limit reached!").
    if (data.Error === 'Movie not found!') {
      return [];
    }
    throw new Error(data.Error || 'OMDb request failed.');
  }

  return data.Search ?? [];
}

/**
 * Fetch full details for a single movie by its IMDb ID.
 * Requests the full plot text.
 * @param {string} imdbID - The IMDb ID (e.g. "tt1375666").
 * @param {AbortSignal} [signal] - Optional AbortController signal for cancellation.
 * @returns {Promise<Object>} Full movie detail object.
 */
export async function getMovieDetails(imdbID, signal) {
  const url = `${BASE_URL}?i=${encodeURIComponent(imdbID)}&plot=full&apikey=${API_KEY}`;
  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new Error(`Network error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || 'Movie not found.');
  }

  return data;
}
