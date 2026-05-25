import PropTypes from 'prop-types';
import './page-header.scss';

/**
 * Page banner used at the top of section pages (e.g. /movies).
 * Falls back to a dark cinematic gradient when no backgroundImage is supplied.
 *
 * @param {string} title              - Required headline.
 * @param {string} [subtitle]         - Optional supporting line under the title.
 * @param {string} [backgroundImage]  - Optional URL for a hero image behind the gradient.
 */
export default function PageHeader({ title, subtitle, backgroundImage }) {
  const style = backgroundImage
    ? { backgroundImage: `linear-gradient(to right, rgba(13,13,13,0.85), rgba(26,26,46,0.6)), url(${backgroundImage})` }
    : undefined;

  return (
    <section
      className={`page-header-banner${backgroundImage ? ' page-header-banner--image' : ''}`}
      style={style}
    >
      <div className="container page-header-banner__inner">
        <h1 className="page-header-banner__title">{title}</h1>
        {subtitle && <p className="page-header-banner__subtitle">{subtitle}</p>}
      </div>
    </section>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  backgroundImage: PropTypes.string,
};
