import { useEffect, useState, useRef } from 'react';
import PageHeader from '../components/page-header/PageHeader';
import Input from '../components/input/Input';
import Button from '../components/button/Button';
import MovieGrid from '../components/movie-grid/MovieGrid';
import { getPopularPaged, searchMoviesPaged } from '../api/tmdb';
import { useDebounce } from '../hooks/useDebounce';

const DEBOUNCE_DELAY = 400;
const MIN_QUERY_LENGTH = 2;

export default function CatalogPage() {
  const [query, setQuery]           = useState('');
  const [movies, setMovies]         = useState([]);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]           = useState(null);

  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);
  // Track which (query, page) tuple is "live" so an outdated response from a
  // previous run can't overwrite fresher results.
  const requestIdRef = useRef(0);

  // Decide which feed to use for a given page.
  function fetchFor(activeQuery, pageToLoad, signal) {
    if (activeQuery.length >= MIN_QUERY_LENGTH) {
      return searchMoviesPaged(activeQuery, pageToLoad, signal);
    }
    return getPopularPaged(pageToLoad, signal);
  }

  // Reset + fetch page 1 whenever the (debounced) query changes.
  useEffect(() => {
    const controller = new AbortController();
    const myId = ++requestIdRef.current;

    async function loadInitial() {
      try {
        setLoading(true);
        setError(null);
        setPage(1);
        const data = await fetchFor(debouncedQuery, 1, controller.signal);
        if (controller.signal.aborted || requestIdRef.current !== myId) return;
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (err) {
        if (err?.name === 'AbortError') return;
        setError(err?.message || 'Failed to load movies. Please try again.');
        setMovies([]);
        setTotalPages(1);
      } finally {
        if (!controller.signal.aborted && requestIdRef.current === myId) {
          setLoading(false);
        }
      }
    }

    loadInitial();
    return () => controller.abort();
  }, [debouncedQuery]);

  async function handleLoadMore() {
    if (loadingMore || loading) return;
    const nextPage = page + 1;
    if (nextPage > totalPages) return;

    const myId = requestIdRef.current;
    setLoadingMore(true);
    try {
      const data = await fetchFor(debouncedQuery, nextPage);
      if (requestIdRef.current !== myId) return; // a newer query took over
      setMovies(prev => [...prev, ...data.results]);
      setPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err) {
      if (err?.name === 'AbortError') return;
      setError(err?.message || 'Failed to load more movies.');
    } finally {
      setLoadingMore(false);
    }
  }

  const showLoadMore = !loading && !error && movies.length > 0 && page < totalPages;
  const isSearching = debouncedQuery.length >= MIN_QUERY_LENGTH;

  return (
    <main className="catalog-page">
      <PageHeader title="Movies" subtitle="Discover the best movies" />

      <div className="container catalog-page__content">
        <div className="catalog-page__search">
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the catalog by title…"
            aria-label="Search movies"
          />
        </div>

        {!loading && !error && movies.length > 0 && (
          <p className="results-meta">
            {isSearching
              ? <>Showing search results for &ldquo;{debouncedQuery}&rdquo;</>
              : <>Showing popular movies</>}
          </p>
        )}

        <MovieGrid
          movies={movies}
          loading={loading}
          error={error}
          query={isSearching ? debouncedQuery : ''}
        />

        {showLoadMore && (
          <div className="catalog-page__load-more">
            <Button
              className="btn--large"
              onClick={handleLoadMore}
              disabled={loadingMore}
              aria-label={loadingMore ? 'Loading more movies' : 'Load more movies'}
            >
              {loadingMore ? 'Loading…' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
