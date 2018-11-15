import React, { useState } from 'react';
import { fireEvent } from 'react-testing-library';
import { render } from '../../../test/utils';
import Input from '../Input';

describe('Components: <Input />', () => {
  it('should render an input component', () => {
    const Comp = () => {
      const [val, setVal] = useState('');
      const handleChange = e => setVal(e.target.value);

      return <Input label="Label" value={val} onChange={handleChange} />;
    };

    const { getByLabelText } = render(<Comp />);
    const input = getByLabelText(/Label/i, { selector: 'input' });
    fireEvent.change(input, { target: { value: 'hello' } });

    expect(input).toHaveAttribute('value', 'hello');
  });

  it('should be able to render an input prefix', () => {
    const { getByText } = render(<Input label="Label" prefix="#" />);
    expect(getByText(/#/)).toBeInTheDocument();
  });
});
