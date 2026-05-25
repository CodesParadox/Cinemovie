import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useWatchlist } from '../../context/WatchlistContext';
import './header.scss';

const SCROLL_THRESHOLD = 50;

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { watchlist } = useWatchlist();
  const [shrunk, setShrunk] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShrunk(window.scrollY > SCROLL_THRESHOLD);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`header${shrunk ? ' shrink' : ''}`}>
      <div className="container header__inner">
        <NavLink to="/" className="header__logo" end>
          <span className="header__logo-icon" aria-hidden="true">🎬</span>
          <span className="header__logo-text">CineMovie</span>
        </NavLink>

        <nav className="header__nav" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `header__link${isActive ? ' active' : ''}`}
          >
            Home
          </NavLink>

          <NavLink
            to="/movies"
            className={({ isActive }) => `header__link${isActive ? ' active' : ''}`}
          >
            Movies
          </NavLink>

          <NavLink
            to="/watchlist"
            className={({ isActive }) => `header__link${isActive ? ' active' : ''}`}
          >
            Watchlist
            {watchlist.length > 0 && (
              <span
                className="header__badge"
                aria-label={`${watchlist.length} movies in watchlist`}
              >
                {watchlist.length}
              </span>
            )}
          </NavLink>

          <button
            className="header__theme-btn"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            type="button"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </nav>
      </div>
    </header>
  );
}
