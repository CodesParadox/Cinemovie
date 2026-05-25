import './movie-card-skeleton.scss';

/**
 * Shimmer placeholder card matching the dimensions of MovieCard.
 * Rendered in a grid while search results are loading.
 */
export default function MovieCardSkeleton() {
  return (
    <div className="movie-card-skeleton" aria-hidden="true">
      <div className="movie-card-skeleton__poster skeleton" />
      <div className="movie-card-skeleton__body">
        <div className="movie-card-skeleton__title skeleton" />
        <div className="movie-card-skeleton__title-2 skeleton" />
        <div className="movie-card-skeleton__year skeleton" />
      </div>
    </div>
  );
}
