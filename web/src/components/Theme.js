import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './GlobalStyle';
import * as theme from '../theme';

function Theme({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        {children}
      </>
    </ThemeProvider>
  );
}

Theme.propTypes = {
  children: PropTypes.node,
};

export default Theme;
