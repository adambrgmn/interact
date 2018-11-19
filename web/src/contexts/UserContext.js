/* eslint-disable react/no-unused-state */
import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { auth, createUser } from '../api/firebase';

const UserContext = createContext();

function UserProvider({ children }) {
  const [state, setState] = useState({ currentUser: null, anonymous: false });

  const updatePartialState = updater =>
    setState(current => ({ ...current, ...updater(current) }));

  useEffect(
    () =>
      auth.onAuthStateChanged(async user => {
        if (user) {
          await createUser({ id: user.uid, ...user });
          updatePartialState(() => ({
            currentUser: user,
            anonymous: user.isAnonymous,
          }));
        } else {
          await auth.signInAnonymously();
        }
      }),
    [],
  );

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };
