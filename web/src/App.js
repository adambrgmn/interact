import React, { Suspense, lazy } from 'react';
import { Router } from '@reach/router';
import ErrorBoundry from './components/ErrorBoundry';
import { UserProvider } from './contexts/UserContext';
import Loading from './components/Loading';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';

const SessionPage = lazy(() => import('./pages/SessionPage.js'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.js'));

function App() {
  return (
    <UserProvider>
      <Header />
      <ErrorBoundry
        renderError={({ error }) => (
          <div>An error occured: {error.message}</div>
        )}
      >
        <Suspense fallback={<Loading />}>
          <Router>
            <LandingPage path="/" />
            <SessionPage path="session/:id" />
            <NotFoundPage default />
          </Router>
        </Suspense>
      </ErrorBoundry>
    </UserProvider>
  );
}

export default App;
