import WatchlistButton from './WatchlistButton';

const NO_POSTER = 'N/A';

/**
 * Cinematic hero section for the movie detail page.
 * Uses the movie poster as a blurred full-bleed background with an overlay.
 * Falls back to a CSS gradient when no poster is available.
 *
 * @param {Object} movie - Full OMDb movie detail object.
 */
export default function HeroBackdrop({ movie }) {
  const hasPoster = movie.Poster && movie.Poster !== NO_POSTER;
  const rating    = movie.imdbRating && movie.imdbRating !== NO_POSTER
    ? movie.imdbRating
    : null;

  return (
    <div className="hero" aria-label={`Hero backdrop for ${movie.Title}`}>
      {hasPoster ? (
        <img
          className="hero__bg-image"
          src={movie.Poster}
          alt=""
          aria-hidden="true"
        />
      ) : (
        <div className="hero__bg-fallback" aria-hidden="true" />
      )}

      <div className="hero__overlay" aria-hidden="true" />

      <div className="hero__content">
        <h1 className="hero__title">{movie.Title}</h1>

        <div className="hero__meta">
          {movie.Year && movie.Year !== NO_POSTER && (
            <span className="hero__badge">{movie.Year}</span>
          )}
          {movie.Runtime && movie.Runtime !== NO_POSTER && (
            <span className="hero__badge">{movie.Runtime}</span>
          )}
          {movie.Rated && movie.Rated !== NO_POSTER && (
            <span className="hero__badge">{movie.Rated}</span>
          )}
          {rating && (
            <span className="hero__badge hero__badge--rating">
              ⭐ {rating} / 10
            </span>
          )}
          {movie.Genre && movie.Genre !== NO_POSTER && (
            <span className="hero__badge">{movie.Genre}</span>
          )}
        </div>

        <div className="hero__actions">
          <WatchlistButton movie={movie} large />
        </div>
      </div>
    </div>
  );
}
