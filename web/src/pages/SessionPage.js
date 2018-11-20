import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserContext, STATUS } from '../contexts/UserContext';
import { SessionResource } from '../api/resources';
import QuestionList from '../components/QuestionList';
import AskQuestion from '../components/AskQuestion';

function SessionPage({ id }) {
  const session = SessionResource.read(id);
  const user = useContext(UserContext);

  let state;

  if (!session) {
    state = 'NOT_FOUND';
  } else if (
    user.status === STATUS.signedOut ||
    (user.status === STATUS.anonymous && !session.allowAnonymous)
  ) {
    state = 'SIGN_IN';
  } else {
    state = 'SHOW_SESSION';
  }

  const openSignInDialog = () => {
    user.emitter.emit('sign-in', {
      allowAnonymous: session.allowAnonymous,
    });
  };

  useEffect(() => state === 'SIGN_IN' && openSignInDialog(), [state]);

  return (
    <main>
      {state === 'NOT_FOUND' && <p>Session not found</p>}
      {state === 'SIGN_IN' && (
        <p>
          You need to sign in{' '}
          <button type="button" onClick={openSignInDialog}>
            Sign in/Sign up
          </button>
        </p>
      )}
      {state === 'SHOW_SESSION' && (
        <>
          <div>
            <h2>{session.name}</h2>
          </div>

          <AskQuestion sessionId={session.id} />
          <QuestionList sessionId={session.id} />
        </>
      )}
    </main>
  );
}

SessionPage.propTypes = {
  id: PropTypes.string.isRequired,
};

export default SessionPage;
