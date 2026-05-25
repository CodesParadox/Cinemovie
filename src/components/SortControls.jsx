const SORT_OPTIONS = [
  { value: 'title', label: 'Title A–Z' },
  { value: 'year',  label: 'Year' },
  { value: 'rating', label: 'Rating' },
];

/**
 * A row of pill buttons for selecting the active sort order.
 *
 * @param {string}   sortBy    - Active sort key ('title' | 'year' | 'rating').
 * @param {Function} onSortBy  - Called with the new sort key when a button is clicked.
 */
export default function SortControls({ sortBy, onSortBy }) {
  return (
    <div className="sort-controls" role="group" aria-label="Sort movies by">
      <span className="sort-controls__label">Sort:</span>
      {SORT_OPTIONS.map(opt => (
        <button
          key={opt.value}
          className={`sort-controls__btn${sortBy === opt.value ? ' sort-controls__btn--active' : ''}`}
          onClick={() => onSortBy(opt.value)}
          aria-pressed={sortBy === opt.value}
          type="button"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
