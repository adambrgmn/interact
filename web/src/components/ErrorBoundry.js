import { Component } from 'react';
import PropTypes from 'prop-types';

const states = {
  error: 'ERROR',
  initial: 'INITIAL',
};

class ErrorBoundry extends Component {
  static propTypes = {
    onError: PropTypes.func,
    renderError: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  state = {
    state: states.initial,
    error: null,
  };

  static getDerivedStateFromError(error) {
    return {
      state: states.error,
      error,
    };
  }

  componentDidCatch(error) {
    const { onError } = this.props;
    if (onError) onError(error);
  }

  reset = () => this.setState(() => ({ state: states.initial, error: null }));

  render() {
    const { children, renderError } = this.props;
    const { state, error } = this.state;

    return state === states.error
      ? renderError({ reset: this.reset, error })
      : children;
  }
}

export default ErrorBoundry;
