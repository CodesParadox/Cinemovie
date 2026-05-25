import MovieCard from '../movie-card/MovieCard';
import MovieCardSkeleton from '../movie-card-skeleton/MovieCardSkeleton';
import './movie-grid.scss';

const SKELETON_COUNT = 10;

/**
 * Renders a responsive grid of MovieCards.
 * Handles all four states: loading (skeletons), error, no-results, and results.
 *
 * @param {Array}   movies         - Array of movie objects to display.
 * @param {boolean} loading        - Show skeleton grid when true.
 * @param {string|null} error      - Error message string, or null.
 * @param {boolean} [isWatchlist]  - Adjusts the empty-state messaging for the watchlist page.
 * @param {string}  [query]        - The active search query (for no-results messaging).
 */
export default function MovieGrid({ movies, loading, error, isWatchlist = false, query = '' }) {
  if (loading) {
    return (
      <div className="movie-grid" aria-busy="true" aria-label="Loading movies">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-screen" role="alert">
        <span className="state-screen__icon">⚠️</span>
        <p className="state-screen__title">Something went wrong</p>
        <p className="state-screen__subtitle">{error}</p>
      </div>
    );
  }

  if (movies.length === 0) {
    if (isWatchlist) {
      return (
        <div className="state-screen">
          <span className="state-screen__icon">🎞️</span>
          <p className="state-screen__title">Your watchlist is empty</p>
          <p className="state-screen__subtitle">
            Add movies from the Discover page to save them here.
          </p>
        </div>
      );
    }

    if (query.length >= 2) {
      return (
        <div className="state-screen">
          <span className="state-screen__icon">🔍</span>
          <p className="state-screen__title">No results for &ldquo;{query}&rdquo;</p>
          <p className="state-screen__subtitle">
            Try a different title, spelling, or keyword.
          </p>
        </div>
      );
    }

    return (
      <div className="state-screen">
        <span className="state-screen__icon">🎬</span>
        <p className="state-screen__title">Find your next favourite film</p>
        <p className="state-screen__subtitle">
          Type a movie title in the search bar to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
