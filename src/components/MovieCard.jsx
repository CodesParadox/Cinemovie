import { Link } from 'react-router-dom';
import WatchlistButton from './WatchlistButton';

const NO_POSTER = 'N/A';

/**
 * A single movie card showing poster, title, year, and rating.
 * Clicking navigates to /movie/:imdbID via React Router Link.
 *
 * @param {Object} movie - OMDb movie object from search results.
 */
export default function MovieCard({ movie }) {
  const hasPoster = movie.Poster && movie.Poster !== NO_POSTER;
  const rating    = movie.imdbRating && movie.imdbRating !== NO_POSTER
    ? movie.imdbRating
    : null;

  return (
    <article className="movie-card">
      <Link
        to={`/movie/${movie.imdbID}`}
        aria-label={`View details for ${movie.Title} (${movie.Year})`}
      >
        <div className="movie-card__poster-wrap">
          {hasPoster ? (
            <img
              className="movie-card__poster"
              src={movie.Poster}
              alt={`${movie.Title} poster`}
              loading="lazy"
            />
          ) : (
            <div className="movie-card__no-poster" aria-hidden="true">
              <span className="movie-card__no-poster-icon">🎞️</span>
              <span>No poster</span>
            </div>
          )}

          {rating && (
            <div className="movie-card__rating-badge" aria-label={`IMDb rating: ${rating}`}>
              ⭐ {rating}
            </div>
          )}

          <div className="movie-card__watchlist-btn-wrap">
            <WatchlistButton movie={movie} />
          </div>
        </div>

        <div className="movie-card__body">
          <h3 className="movie-card__title">{movie.Title}</h3>
          <p className="movie-card__year">{movie.Year}</p>
        </div>
      </Link>
    </article>
  );
}
