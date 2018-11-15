/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render } from 'react-testing-library';
import Theme from '../src/components/Theme';

const customRender = (node, options) => render(<Theme>{node}</Theme>, options);

export { customRender as render };
