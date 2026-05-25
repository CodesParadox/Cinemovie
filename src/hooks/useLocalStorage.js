import { useState, useEffect } from 'react';

/**
 * A useState-like hook that persists its value to localStorage.
 * Safe to use in private-browsing contexts: falls back to in-memory state
 * if localStorage is unavailable or throws.
 *
 * @param {string} key - The localStorage key.
 * @param {*} initialValue - Value to use when the key does not yet exist.
 * @returns {[*, Function]} [storedValue, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // localStorage write failed (e.g. quota exceeded or private browsing).
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
