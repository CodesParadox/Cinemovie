import { useEffect } from 'react';
import PropTypes from 'prop-types';
import './modal.scss';

/**
 * Overlay wrapper. Renders a fixed full-viewport backdrop when `open` is true.
 * Clicking the backdrop or pressing Escape calls `onClose`.
 *
 * @param {boolean}  open
 * @param {Function} onClose
 * @param {string}   [id]
 * @param {React.ReactNode} children
 */
export default function Modal({ open, onClose, id, children }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose?.();
  }

  return (
    <div
      id={id}
      className="modal modal--open"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
}

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  id: PropTypes.string,
  children: PropTypes.node,
};
