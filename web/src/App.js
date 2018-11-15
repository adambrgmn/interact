import React from 'react';
import { Router } from '@reach/router';
import Theme from './components/Theme';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';

function App() {
  return (
    <Theme>
      <Header />

      <Router>
        <Landing path="/" />
      </Router>

      <Footer />
    </Theme>
  );
}

export default App;
