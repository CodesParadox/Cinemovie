import PropTypes from 'prop-types';
import Button from './Button';

/**
 * Ghost / outline variant of Button — same API.
 */
export default function OutlineButton({ className = '', children, ...rest }) {
  return (
    <Button className={`btn--outline ${className}`.trim()} {...rest}>
      {children}
    </Button>
  );
}

OutlineButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
