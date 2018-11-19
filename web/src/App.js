import React, { Suspense, lazy } from 'react';
import { Router } from '@reach/router';
import ErrorBoundry from './components/ErrorBoundry';
import Header from './components/Header';
import Landing from './pages/Landing';

const Session = lazy(() => import('./pages/Session.js'));

function App() {
  return (
    <>
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
      </ErrorBoundry>
    </>
  );
}

export default App;
