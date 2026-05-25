import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useWatchlist } from '../../context/WatchlistContext';
import './navbar.scss';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { watchlist } = useWatchlist();

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__logo">
          <span className="navbar__logo-icon">🎬</span>
          <span>Cine<span className="navbar__logo-word">phile</span></span>
        </NavLink>

        <nav className="navbar__actions" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar__link${isActive ? ' active' : ''}`
            }
          >
            Discover
          </NavLink>

          <NavLink
            to="/watchlist"
            className={({ isActive }) =>
              `navbar__link${isActive ? ' active' : ''}`
            }
          >
            Watchlist
            {watchlist.length > 0 && (
              <span className="navbar__link-badge" aria-label={`${watchlist.length} movies in watchlist`}>
                {watchlist.length}
              </span>
            )}
          </NavLink>

          <button
            className="navbar__theme-btn"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </nav>
      </div>
    </header>
  );
}
