import PropTypes from 'prop-types';

/**
 * The styled inner content box for Modal. Renders an absolutely-positioned
 * close button (×) that delegates to the same onClose the Modal uses.
 *
 * @param {Function} [onClose]
 * @param {string}   [className]
 * @param {React.ReactNode} children
 */
export default function ModalContent({ onClose, className = '', children }) {
  return (
    <div className={`modal__content ${className}`.trim()}>
      {children}

      {onClose && (
        <button
          type="button"
          className="modal__content-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          ✕
        </button>
      )}
    </div>
  );
}

ModalContent.propTypes = {
  onClose: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
};
