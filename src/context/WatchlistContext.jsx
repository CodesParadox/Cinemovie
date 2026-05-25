import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useLocalStorage('cinephile_watchlist', []);

  const addToWatchlist = useCallback((movie) => {
    setWatchlist(prev => {
      if (prev.some(m => m.imdbID === movie.imdbID)) return prev;
      // Store only the fields needed to render a MovieCard without re-fetching.
      return [
        ...prev,
        {
          imdbID: movie.imdbID,
          Title: movie.Title,
          Year: movie.Year,
          Poster: movie.Poster,
          imdbRating: movie.imdbRating,
          Type: movie.Type,
        },
      ];
    });
  }, [setWatchlist]);

  const removeFromWatchlist = useCallback((imdbID) => {
    setWatchlist(prev => prev.filter(m => m.imdbID !== imdbID));
  }, [setWatchlist]);

  const isInWatchlist = useCallback((imdbID) => {
    return watchlist.some(m => m.imdbID === imdbID);
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
