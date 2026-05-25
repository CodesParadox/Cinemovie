import { useWatchlist } from '../../context/WatchlistContext';
import './watchlist-button.scss';

/**
 * Add-to / Remove-from watchlist button.
 *
 * @param {Object}  movie   - The movie object (needs at least id + display fields).
 * @param {boolean} [large] - Renders a pill-shaped button with text label when true.
 */
export default function WatchlistButton({ movie, large = false }) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const inList = isInWatchlist(movie.id);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (inList) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  }

  const label = inList ? 'Remove from watchlist' : 'Add to watchlist';
  const icon  = inList ? '🔖' : '➕';

  if (large) {
    return (
      <button
        className={`watchlist-btn watchlist-btn--large${inList ? ' watchlist-btn--active' : ''}`}
        onClick={handleClick}
        aria-label={label}
        type="button"
      >
        <span aria-hidden="true">{icon}</span>
        <span className="watchlist-btn__label">{inList ? 'In Watchlist' : 'Add to Watchlist'}</span>
      </button>
    );
  }

  return (
    <button
      className={`watchlist-btn${inList ? ' watchlist-btn--active' : ''}`}
      onClick={handleClick}
      aria-label={label}
      title={label}
      type="button"
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}
