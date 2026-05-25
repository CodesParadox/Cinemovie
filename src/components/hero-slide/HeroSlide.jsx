import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Button from '../button/Button';
import OutlineButton from '../button/OutlineButton';
import { useWatchlist } from '../../context/WatchlistContext';
import { getTrending, BACKDROP_URL } from '../../api/tmdb';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './hero-slide.scss';

const SLIDE_COUNT = 5;
const OVERVIEW_LIMIT = 150;

function truncate(text, max) {
  if (!text) return '';
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

function HeroSkeleton() {
  return (
    <div className="hero-slide hero-slide--skeleton" aria-busy="true">
      <div className="hero-slide__item">
        <div className="hero-slide__bg skeleton" />
        <div className="container hero-slide__content">
          <div className="skeleton hero-slide__sk-title" />
          <div className="skeleton hero-slide__sk-line" />
          <div className="skeleton hero-slide__sk-line hero-slide__sk-line--short" />
          <div className="hero-slide__buttons">
            <div className="skeleton hero-slide__sk-btn" />
            <div className="skeleton hero-slide__sk-btn" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSlideItem({ movie }) {
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const inList = isInWatchlist(movie.id);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  function handleWatchNow() {
    navigate(`/movie/${movie.id}`);
  }

  function handleWatchlist() {
    if (inList) removeFromWatchlist(movie.id);
    else addToWatchlist(movie);
  }

  const bgUrl = movie.backdrop_path
    ? `${BACKDROP_URL}${movie.backdrop_path}`
    : null;

  return (
    <div className="hero-slide__item">
      {bgUrl ? (
        <img
          className="hero-slide__bg"
          src={bgUrl}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
      ) : (
        <div className="hero-slide__bg hero-slide__bg--fallback" aria-hidden="true" />
      )}
      <div className="hero-slide__overlay" aria-hidden="true" />

      <div className="container hero-slide__content">
        {rating && (
          <span className="hero-slide__rating" aria-label={`TMDB rating ${rating} out of 10`}>
            ⭐ {rating}
          </span>
        )}
        <h2 className="hero-slide__title">
          <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
        </h2>
        <p className="hero-slide__overview">{truncate(movie.overview, OVERVIEW_LIMIT)}</p>

        <div className="hero-slide__buttons">
          <Button className="btn--large hero-slide__btn" onClick={handleWatchNow}>
            ▶ Watch Now
          </Button>
          <OutlineButton
            className={`btn--large hero-slide__btn${inList ? ' hero-slide__btn--active' : ''}`}
            onClick={handleWatchlist}
          >
            {inList ? '🔖 In Watchlist' : '➕ Add to Watchlist'}
          </OutlineButton>
        </div>
      </div>
    </div>
  );
}

export default function HeroSlide() {
  const [movies, setMovies]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTrending('week', controller.signal);
        if (cancelled || controller.signal.aborted) return;
        setMovies(Array.isArray(data) ? data.slice(0, SLIDE_COUNT) : []);
      } catch (err) {
        const isAbort =
          err?.name === 'AbortError' ||
          /aborted|NS_BINDING_ABORTED/i.test(err?.message || '');
        if (cancelled || isAbort) return;
        // eslint-disable-next-line no-console
        console.warn('[HeroSlide] failed to load trending:', err);
        setError(err?.message || 'Failed to load trending movies');
        setMovies([]);
      } finally {
        if (!cancelled && !controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  if (loading) return <HeroSkeleton />;

  if (error || movies.length === 0) {
    return null;
  }

  return (
    <section className="hero-slide" aria-label="Trending movies">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        slidesPerView={1}
        loop={movies.length > 1}
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        navigation
        pagination={{ clickable: true }}
        grabCursor
      >
        {movies.map((m) => (
          <SwiperSlide key={m.id}>
            <HeroSlideItem movie={m} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
