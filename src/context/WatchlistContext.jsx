import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  // Storage key bumped to v2 because the stored shape changed from OMDb (Title/Year/Poster/imdbID)
  // to TMDB (title/release_date/poster_path/id). Pre-existing v1 entries are intentionally retired.
  const [watchlist, setWatchlist] = useLocalStorage('cinephile_watchlist_v2', []);

  const addToWatchlist = useCallback((movie) => {
    setWatchlist(prev => {
      if (prev.some(m => m.id === movie.id)) return prev;
      // Store only the fields needed to render a MovieCard without re-fetching.
      return [
        ...prev,
        {
          id: movie.id,
          title: movie.title,
          release_date: movie.release_date,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          media_type: 'movie',
        },
      ];
    });
  }, [setWatchlist]);

  const removeFromWatchlist = useCallback((id) => {
    setWatchlist(prev => prev.filter(m => m.id !== id));
  }, [setWatchlist]);

  const isInWatchlist = useCallback((id) => {
    return watchlist.some(m => m.id === id);
  }, [watchlist]);

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used inside WatchlistProvider');
  return ctx;
}
