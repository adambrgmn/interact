/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render } from 'react-testing-library';
import { ThemeProvider } from 'styled-components';
import * as theme from '../src/theme';

const customRender = (node, options) =>
  render(<ThemeProvider theme={theme}>{node}</ThemeProvider>, options);

export { customRender as render };
