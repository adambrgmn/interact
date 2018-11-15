/* eslint-disable react/prop-types, no-console */
import React, { useState } from 'react';
import { render, fireEvent } from 'react-testing-library';
import ErrorBoundry from '../ErrorBoundry';

const renderError = ({ reset }) => (
  <button type="button" onClick={reset}>
    Reset
  </button>
);

class RenderError {
  constructor(message) {
    this.message = message;
  }
}

const Throw = () => {
  throw new RenderError('Component did throw');
};

describe('Component: <ErrorBoundry />', () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  it('should handle errors', () => {
    const { getByText } = render(
      <ErrorBoundry renderError={renderError}>
        <Throw />
      </ErrorBoundry>,
    );

    const btn = getByText(/reset/i);
    expect(btn).toBeInTheDocument();
  });

  it('should be able to reset state', () => {
    const Comp = () => {
      const [shouldThrow, setShouldThrow] = useState(true);

      return (
        <ErrorBoundry
          renderError={renderError}
          onError={() => setShouldThrow(false)}
        >
          {shouldThrow ? <Throw /> : <p>No throw</p>}
        </ErrorBoundry>
      );
    };

    const { getByText } = render(<Comp />);

    const btn = getByText(/reset/i);
    fireEvent.click(btn);

    expect(getByText(/no throw/i)).toBeInTheDocument();
  });

  it('should provide an onError handler', () => {
    const handleError = jest.fn();
    render(
      <ErrorBoundry renderError={renderError} onError={handleError}>
        <Throw />
      </ErrorBoundry>,
    );

    expect(handleError).toHaveBeenCalled();
    expect(handleError).toHaveBeenCalledWith(expect.any(RenderError));
  });
});
