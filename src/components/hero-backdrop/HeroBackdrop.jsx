import WatchlistButton from '../watchlist-button/WatchlistButton';
import { BACKDROP_URL } from '../../api/tmdb';
import './hero-backdrop.scss';

/**
 * Cinematic hero section for the movie detail page.
 * Uses the TMDB backdrop (fallback to poster) as a blurred full-bleed background.
 * Falls back to a CSS gradient when no image is available.
 *
 * @param {Object} movie - Full TMDB movie detail object.
 */
export default function HeroBackdrop({ movie }) {
  const imagePath = movie.backdrop_path || movie.poster_path;
  const hasImage  = !!imagePath;
  const rating    = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const year      = movie.release_date ? movie.release_date.slice(0, 4) : null;
  const runtime   = movie.runtime ? `${movie.runtime} min` : null;
  const genres    = movie.genres?.length ? movie.genres.map(g => g.name).join(', ') : null;

  return (
    <div className="hero" aria-label={`Hero backdrop for ${movie.title}`}>
      {hasImage ? (
        <img
          className="hero__bg-image"
          src={`${BACKDROP_URL}${imagePath}`}
          alt=""
          aria-hidden="true"
        />
      ) : (
        <div className="hero__bg-fallback" aria-hidden="true" />
      )}

      <div className="hero__overlay" aria-hidden="true" />

      <div className="hero__content">
        <h1 className="hero__title">{movie.title}</h1>

        <div className="hero__meta">
          {year && (
            <span className="hero__badge">{year}</span>
          )}
          {runtime && (
            <span className="hero__badge">{runtime}</span>
          )}
          {rating && (
            <span className="hero__badge hero__badge--rating">
              ⭐ {rating} / 10
            </span>
          )}
          {genres && (
            <span className="hero__badge">{genres}</span>
          )}
        </div>

        <div className="hero__actions">
          <WatchlistButton movie={movie} large />
        </div>
      </div>
    </div>
  );
}
