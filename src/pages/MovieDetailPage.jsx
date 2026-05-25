import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, IMG_URL } from '../api/tmdb';
import HeroBackdrop from '../components/hero-backdrop/HeroBackdrop';

function MetaItem({ label, value }) {
  if (!value) return null;
  return (
    <div className="detail-meta-item">
      <span className="detail-meta-item__label">{label}</span>
      <span className="detail-meta-item__value">{value}</span>
    </div>
  );
}

const CURRENCY_FMT = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function fetchDetail() {
      setLoading(true);
      setError(null);
      setMovie(null);
      try {
        const data = await getMovieDetails(id, controller.signal);
        if (!controller.signal.aborted) {
          setMovie(data);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load movie details.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchDetail();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="page-content">
        <div className="hero-skeleton skeleton" aria-label="Loading movie details" aria-busy="true" />
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem' }}>
            <div className="skeleton" style={{ aspectRatio: '2/3', borderRadius: 'var(--radius)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="skeleton" style={{ height: '1rem', width: '70%', borderRadius: 'var(--radius-sm)' }} />
              <div className="skeleton" style={{ height: '1rem', width: '90%', borderRadius: 'var(--radius-sm)' }} />
              <div className="skeleton" style={{ height: '1rem', width: '55%', borderRadius: 'var(--radius-sm)' }} />
              <div className="skeleton" style={{ height: '1rem', width: '80%', borderRadius: 'var(--radius-sm)', marginTop: '1rem' }} />
              <div className="skeleton" style={{ height: '1rem', width: '75%', borderRadius: 'var(--radius-sm)' }} />
              <div className="skeleton" style={{ height: '1rem', width: '60%', borderRadius: 'var(--radius-sm)' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="container">
          <Link to="/" className="back-btn">← Back to Discover</Link>
          <div className="state-screen" role="alert">
            <span className="state-screen__icon">⚠️</span>
            <p className="state-screen__title">Could not load this movie</p>
            <p className="state-screen__subtitle">{error}</p>
            <Link to="/" className="state-screen__action">Go back</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const castList = movie.credits?.cast?.slice(0, 8).map(c => c.name) ?? [];
  const plot     = movie.overview || 'No plot summary available.';
  // Prefer the first official YouTube trailer; fall back to any YouTube video typed "Trailer".
  const trailer  = movie.videos?.results?.find(
    v => v.type === 'Trailer' && v.site === 'YouTube' && v.official
  ) || movie.videos?.results?.find(
    v => v.type === 'Trailer' && v.site === 'YouTube'
  );

  const director = movie.credits?.crew?.find(c => c.job === 'Director')?.name;
  const writers  = movie.credits?.crew
    ?.filter(c => ['Writer', 'Screenplay', 'Story'].includes(c.job))
    .map(c => c.name);
  const writer   = writers && writers.length ? Array.from(new Set(writers)).join(', ') : null;
  const released = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;
  const runtime  = movie.runtime ? `${movie.runtime} min` : null;
  const genre    = movie.genres?.length ? movie.genres.map(g => g.name).join(', ') : null;
  const language = movie.spoken_languages?.[0]?.english_name
    || (movie.original_language ? movie.original_language.toUpperCase() : null);
  const country  = movie.production_countries?.length
    ? movie.production_countries.map(c => c.name).join(', ')
    : null;
  const boxOffice = movie.revenue ? CURRENCY_FMT.format(movie.revenue) : null;

  return (
    <div className="page-content">
      <HeroBackdrop movie={movie} />

      <div className="container">
        <Link to="/" className="back-btn">← Back to Discover</Link>

        <div className="detail-layout">
          {/* Sidebar poster */}
          <aside className="detail-poster">
            {movie.poster_path ? (
              <img src={`${IMG_URL}${movie.poster_path}`} alt={`${movie.title} poster`} />
            ) : (
              <div className="detail-poster__fallback" aria-hidden="true">🎞️</div>
            )}
          </aside>

          {/* Main info */}
          <div className="detail-info">

            {/* Plot */}
            <section aria-labelledby="plot-heading">
              <h2 className="detail-section-title" id="plot-heading">Plot</h2>
              <p className="detail-plot">{plot}</p>
            </section>

            {/* Cast */}
            {castList.length > 0 && (
              <section aria-labelledby="cast-heading">
                <h2 className="detail-section-title" id="cast-heading">Cast</h2>
                <div className="detail-cast">
                  {castList.map(actor => (
                    <span key={actor} className="detail-cast__chip">{actor}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Trailer (sits between Cast and Details when one is available) */}
            {trailer && (
              <section aria-labelledby="trailer-heading">
                <h2 className="detail-section-title" id="trailer-heading">Trailer</h2>
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={`${movie.title} — Official Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  style={{
                    width: '100%',
                    aspectRatio: '16 / 9',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-card)',
                  }}
                />
              </section>
            )}

            {/* Extra metadata */}
            <section aria-labelledby="details-heading">
              <h2 className="detail-section-title" id="details-heading">Details</h2>
              <div className="detail-meta-grid">
                <MetaItem label="Director"  value={director} />
                <MetaItem label="Writer"    value={writer} />
                <MetaItem label="Released"  value={released} />
                <MetaItem label="Runtime"   value={runtime} />
                <MetaItem label="Genre"     value={genre} />
                <MetaItem label="Language"  value={language} />
                <MetaItem label="Country"   value={country} />
                <MetaItem label="Box Office" value={boxOffice} />
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
