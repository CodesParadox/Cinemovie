import PropTypes from 'prop-types';
import './button.scss';

/**
 * Primary filled button.
 *
 * @param {string}   [className]
 * @param {Function} [onClick]
 * @param {string}   [type='button']
 * @param {boolean}  [disabled]
 * @param {React.ReactNode} children
 */
export default function Button({ className = '', onClick, type = 'button', disabled = false, children, ...rest }) {
  return (
    <button
      type={type}
      className={`btn ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  children: PropTypes.node,
};
