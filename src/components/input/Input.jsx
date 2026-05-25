import PropTypes from 'prop-types';
import './input.scss';

/**
 * Styled text input with controlled value/onChange.
 *
 * @param {string} [type='text']
 * @param {string} value
 * @param {Function} onChange  - called with the native event
 * @param {string} [placeholder]
 * @param {string} [className]
 */
export default function Input({ type = 'text', value, onChange, placeholder = '', className = '', ...rest }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`input ${className}`.trim()}
      {...rest}
    />
  );
}

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};
