import { Link } from 'react-router-dom';
import WatchlistButton from '../watchlist-button/WatchlistButton';
import { IMG_URL } from '../../api/tmdb';
import './movie-card.scss';

/**
 * A single movie card showing poster, title, year, and rating.
 * Clicking navigates to /movie/:id via React Router Link.
 *
 * @param {Object} movie - TMDB movie object from search results.
 */
export default function MovieCard({ movie }) {
  const hasPoster = !!movie.poster_path;
  const rating    = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const year      = movie.release_date ? movie.release_date.slice(0, 4) : '';

  return (
    <article className="movie-card">
      <Link
        to={`/movie/${movie.id}`}
        aria-label={`View details for ${movie.title}${year ? ` (${year})` : ''}`}
      >
        <div className="movie-card__poster-wrap">
          {hasPoster ? (
            <img
              className="movie-card__poster"
              src={`${IMG_URL}${movie.poster_path}`}
              alt={`${movie.title} poster`}
              loading="lazy"
            />
          ) : (
            <div className="movie-card__no-poster" aria-hidden="true">
              <span className="movie-card__no-poster-icon">🎞️</span>
              <span>No poster</span>
            </div>
          )}

          {rating && (
            <div className="movie-card__rating-badge" aria-label={`TMDB rating: ${rating}`}>
              ⭐ {rating}
            </div>
          )}

          <div className="movie-card__watchlist-btn-wrap">
            <WatchlistButton movie={movie} />
          </div>
        </div>

        <div className="movie-card__body">
          <h3 className="movie-card__title">{movie.title}</h3>
          <p className="movie-card__year">{year}</p>
        </div>
      </Link>
    </article>
  );
}
