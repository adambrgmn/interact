/* eslint-disable react/prop-types, react/button-has-type */
import React, { useState } from 'react';
import { render, fireEvent } from 'react-testing-library';
import Tabs from '../Tabs';

describe('Component: <Tabs />', () => {
  const Msg = ({ msg }) => <p>message: {msg}</p>;
  const Comp = ({ initialTab }) => {
    const [current, setCurrent] = useState(initialTab);
    return (
      <>
        <button onClick={() => setCurrent('one')}>select one</button>
        <button onClick={() => setCurrent('two')}>select two</button>
        <button onClick={() => setCurrent('three')}>select three</button>

        <Tabs currentTab={current}>
          <Msg tab="one" msg="one" />
          <Msg tab="two" msg="two" />
          <Msg tab="three" msg="three" />
        </Tabs>
      </>
    );
  };

  it('should render the current tab', () => {
    const { getByText } = render(<Comp initialTab="one" />);

    expect(getByText(/message: one/i)).toBeInTheDocument();
    expect(() => getByText(/message: two/i)).toThrow();
    expect(() => getByText(/message: three/i)).toThrow();

    fireEvent.click(getByText(/select two/i));
    expect(() => getByText(/message: one/i)).toThrow();
    expect(getByText(/message: two/i)).toBeInTheDocument();
    expect(() => getByText(/message: three/i)).toThrow();

    fireEvent.click(getByText(/select three/i));
    expect(() => getByText(/message: one/i)).toThrow();
    expect(() => getByText(/message: two/i)).toThrow();
    expect(getByText(/message: three/i)).toBeInTheDocument();
  });
});
