import React, { Suspense, lazy } from 'react';
import { Router } from '@reach/router';
import Theme from './components/Theme';
import ErrorBoundry from './components/ErrorBoundry';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';

const Session = lazy(() => import('./pages/Session.js'));

function App() {
  return (
    <Theme>
      <Header />
      <ErrorBoundry
        renderError={({ error }) => (
          <div>An error occured: {error.message}</div>
        )}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Router>
            <Landing path="/" />
            <Session path="session/:id" />
          </Router>
        </Suspense>

        <Footer />
      </ErrorBoundry>
    </Theme>
  );
}

export default App;
