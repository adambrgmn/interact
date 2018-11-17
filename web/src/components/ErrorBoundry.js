import React, { Component, Suspense } from 'react';
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

  componentDidCatch(error) {
    const { onError } = this.props;
    if (onError) onError(error);
    this.setState(() => ({ state: states.error, error }));
  }

  reset = () => this.setState(() => ({ state: states.initial, error: null }));

  render() {
    const { children, renderError } = this.props;
    const { state, error } = this.state;

    return (
      <Suspense fallback={<div>Loading...</div>}>
        {state === states.error
          ? renderError({ reset: this.reset, error })
          : children}
      </Suspense>
    );
  }
}

export default ErrorBoundry;
