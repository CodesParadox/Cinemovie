import { useEffect, useRef } from 'react';
import './search-bar.scss';

/**
 * Controlled search input with auto-focus on first mount.
 *
 * @param {string}   value      - Current input value (controlled).
 * @param {Function} onChange   - Called with new string on every keystroke.
 * @param {string}   [placeholder]
 */
export default function SearchBar({ value, onChange, placeholder = 'Search movies… e.g. "Inception", "Batman"' }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleClear() {
    onChange('');
    inputRef.current?.focus();
  }

  return (
    <div className="search-bar" role="search">
      <span className="search-bar__icon" aria-hidden="true">🔍</span>
      <input
        ref={inputRef}
        type="search"
        className="search-bar__input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search movies"
        autoComplete="off"
        spellCheck="false"
      />
      {value && (
        <button
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Clear search"
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
}
