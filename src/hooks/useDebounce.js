import { useState, useEffect } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after
 * `delay` ms have passed since the last change.
 *
 * @param {*} value - The value to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {*} The debounced value.
 */
export function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
