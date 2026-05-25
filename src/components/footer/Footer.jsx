import { Link } from 'react-router-dom';
import './footer.scss';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__col footer__col--brand">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-text">CineMovie</span>
            <span className="footer__logo-icon" aria-hidden="true">🎬</span>
          </Link>
          <p className="footer__tagline">Your personal movie universe</p>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Navigate</h4>
          <ul className="footer__links">
            <li><Link to="/" className="footer__link">Home</Link></li>
            <li><Link to="/movies" className="footer__link">Movies</Link></li>
            <li><Link to="/watchlist" className="footer__link">Watchlist</Link></li>
          </ul>
        </div>

        <div className="footer__col footer__col--credits">
          <h4 className="footer__heading">Powered by</h4>
          <p className="footer__credit">Built with React + TMDB API</p>
          <a
            className="footer__tmdb"
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="The Movie Database (TMDB)"
          >
            <span className="footer__tmdb-mark" aria-hidden="true">TMDB</span>
            <span className="footer__tmdb-text">The Movie Database</span>
          </a>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} CineMovie. All movie data via TMDB.</span>
      </div>
    </footer>
  );
}
