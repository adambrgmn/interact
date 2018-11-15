import { PureComponent } from 'react';
import PropTypes from 'prop-types';

const states = {
  error: 'ERROR',
  initial: 'INITIAL',
};

class ErrorBoundry extends PureComponent {
  static propTypes = {
    onError: PropTypes.func,
    renderError: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  state = {
    state: states.initial,
  };

  componentDidCatch(error) {
    const { onError } = this.props;
    if (onError) onError(error);
    this.setState(() => ({ state: states.error }));
  }

  reset = () => this.setState(() => ({ state: states.initial }));

  render() {
    const { children, renderError } = this.props;
    const { state } = this.state;

    if (state === states.error) return renderError({ reset: this.reset });
    return children;
  }
}

export default ErrorBoundry;
