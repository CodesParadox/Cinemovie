import { useState, useEffect, useMemo } from 'react';
import HeroSlide from '../components/hero-slide/HeroSlide';
import ErrorBoundary from '../components/error-boundary/ErrorBoundary';
import SearchBar from '../components/search-bar/SearchBar';
import SortControls from '../components/sort-controls/SortControls';
import MovieGrid from '../components/movie-grid/MovieGrid';
import { searchMovies } from '../api/tmdb';
import { useDebounce } from '../hooks/useDebounce';

const DEBOUNCE_DELAY = 400;
const MIN_QUERY_LENGTH = 2;

function sortMovies(movies, sortBy) {
  const copy = [...movies];
  switch (sortBy) {
    case 'year':
      return copy.sort((a, b) => {
        const ya = parseInt(a.release_date) || 0;
        const yb = parseInt(b.release_date) || 0;
        return yb - ya;
      });
    case 'rating':
      return copy.sort((a, b) => {
        const ra = a.vote_average || 0;
        const rb = b.vote_average || 0;
        return rb - ra;
      });
    case 'title':
    default:
      return copy.sort((a, b) => a.title.localeCompare(b.title));
  }
}

export default function HomePage() {
  const [query, setQuery]   = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);
  const [sortBy, setSortBy] = useState('title');

  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);

  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      setMovies([]);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchMovies() {
      setLoading(true);
      setError(null);
      try {
        const results = await searchMovies(debouncedQuery, controller.signal);
        if (!controller.signal.aborted) {
          setMovies(results);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch movies. Please try again.');
          setMovies([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchMovies();

    return () => controller.abort();
  }, [debouncedQuery]);

  const sortedMovies = useMemo(() => sortMovies(movies, sortBy), [movies, sortBy]);

  const showSortControls = !loading && !error && movies.length > 1;

  return (
    <main className="home-page">
      <ErrorBoundary label="HeroSlide">
        <HeroSlide />
      </ErrorBoundary>
      <div className="container home-page__content">
        <SearchBar value={query} onChange={setQuery} />

        {showSortControls && (
          <>
            <p className="results-meta">
              {sortedMovies.length} result{sortedMovies.length !== 1 ? 's' : ''} for &ldquo;{debouncedQuery}&rdquo;
            </p>
            <SortControls sortBy={sortBy} onSortBy={setSortBy} />
          </>
        )}

        <MovieGrid
          movies={sortedMovies}
          loading={loading}
          error={error}
          query={debouncedQuery}
        />
      </div>
    </main>
  );
}
