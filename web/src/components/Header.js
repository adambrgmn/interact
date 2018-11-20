import React, { useContext } from 'react';
import { Link } from '@reach/router';
import { UserContext, STATUS } from '../contexts/UserContext';

function Header() {
  const { status, currentUser, signOut, emitter } = useContext(UserContext);

  return (
    <header>
      <div>
        <h1>
          <Link to="/">Interact</Link>
        </h1>
      </div>
      <div>
        {status === STATUS.signedOut && <span>Not signed in</span>}
        {status === STATUS.signedIn && (
          <span>{currentUser.displayName || currentUser.email}</span>
        )}
        {status === STATUS.anonymous && <span>Anonymous</span>}
        {status === STATUS.signedIn || status === STATUS.anonymous ? (
          <button type="button" onClick={signOut}>
            Sign out
          </button>
        ) : (
          <button
            type="button"
            onClick={() => emitter.emit('sign-in', { allowAnonymous: false })}
          >
            Sign in/Sign up
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
