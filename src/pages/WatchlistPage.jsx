import { useWatchlist } from '../context/WatchlistContext';
import MovieGrid from '../components/MovieGrid';

export default function WatchlistPage() {
  const { watchlist } = useWatchlist();

  return (
    <main className="page-content">
      <div className="container">
        <div className="page-header">
          <h1 className="page-header__title">My Watchlist</h1>
          {watchlist.length > 0 && (
            <p className="page-header__subtitle">
              {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''} saved
            </p>
          )}
        </div>

        <MovieGrid
          movies={watchlist}
          loading={false}
          error={null}
          isWatchlist
        />
      </div>
    </main>
  );
}
