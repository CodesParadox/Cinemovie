import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Generic error boundary. Renders `fallback` (or a small default banner) when
 * any descendant throws during render / lifecycle. Use to isolate flaky widgets
 * (e.g. the hero slider) so a single failure does not blank the whole app.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Keep the failure visible in DevTools but never let it propagate.
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', this.props.label || '', error, info?.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;

    if (typeof this.props.fallback === 'function') {
      return this.props.fallback(this.state.error, this.reset);
    }
    if (this.props.fallback !== undefined) return this.props.fallback;

    if (this.props.silent) return null;

    return (
      <div role="alert" style={{
        padding: '1.25rem',
        margin: '1rem',
        border: '1px solid var(--border, #444)',
        borderRadius: 'var(--radius-sm, 6px)',
        background: 'var(--surface, #1a1a2e)',
        color: 'var(--text, #f0f0f8)',
        fontSize: '0.9rem',
      }}>
        <strong>Something went wrong{this.props.label ? ` in ${this.props.label}` : ''}.</strong>
        <div style={{ marginTop: '0.4rem', color: 'var(--text-muted, #9090ab)' }}>
          {this.state.error?.message || 'Unknown error'}
        </div>
      </div>
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  silent: PropTypes.bool,
  label: PropTypes.string,
};
