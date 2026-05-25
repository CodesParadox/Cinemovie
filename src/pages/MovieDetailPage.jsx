import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails } from '../api/omdb';
import HeroBackdrop from '../components/HeroBackdrop';

const NA = 'N/A';

function MetaItem({ label, value }) {
  if (!value || value === NA) return null;
  return (
    <div className="detail-meta-item">
      <span className="detail-meta-item__label">{label}</span>
      <span className="detail-meta-item__value">{value}</span>
    </div>
  );
}

export default function MovieDetailPage() {
  const { imdbID } = useParams();
  const [movie, setMovie]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (!imdbID) return;

    const controller = new AbortController();

    async function fetchDetail() {
      setLoading(true);
      setError(null);
      setMovie(null);
      try {
        const data = await getMovieDetails(imdbID, controller.signal);
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
  }, [imdbID]);

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

  const castList = movie.Actors && movie.Actors !== NA
    ? movie.Actors.split(',').map(a => a.trim()).filter(Boolean)
    : [];

  const plot = movie.Plot && movie.Plot !== NA ? movie.Plot : 'No plot summary available.';

  return (
    <div className="page-content">
      <HeroBackdrop movie={movie} />

      <div className="container">
        <Link to="/" className="back-btn">← Back to Discover</Link>

        <div className="detail-layout">
          {/* Sidebar poster */}
          <aside className="detail-poster">
            {movie.Poster && movie.Poster !== NA ? (
              <img src={movie.Poster} alt={`${movie.Title} poster`} />
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

            {/* Extra metadata */}
            <section aria-labelledby="details-heading">
              <h2 className="detail-section-title" id="details-heading">Details</h2>
              <div className="detail-meta-grid">
                <MetaItem label="Director"  value={movie.Director} />
                <MetaItem label="Writer"    value={movie.Writer} />
                <MetaItem label="Released"  value={movie.Released} />
                <MetaItem label="Runtime"   value={movie.Runtime} />
                <MetaItem label="Genre"     value={movie.Genre} />
                <MetaItem label="Language"  value={movie.Language} />
                <MetaItem label="Country"   value={movie.Country} />
                <MetaItem label="Box Office" value={movie.BoxOffice} />
                <MetaItem label="Awards"    value={movie.Awards} />
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
