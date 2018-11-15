import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Router } from '@reach/router';
import * as theme from './theme';
import Header from './components/Header';
import Footer from './components/Footer';
import GlobalStyle from './components/GlobalStyle';
import Landing from './pages/Landing';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        <Header />

        <Router>
          <Landing path="/" />
        </Router>

        <Footer />
      </>
    </ThemeProvider>
  );
}

export default App;
