/* eslint-disable react/no-unused-state */
import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import mitt from 'mitt';
import { firebase, auth, createProfile } from '../api/firebase';

const UserContext = createContext();

const signInAnonymously = () => {
  auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
  return auth.signInAnonymously();
};

const signInWithEmailAndPassword = ({ email, password }) => {
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  return auth.signInWithEmailAndPassword(email, password);
};

const createUserWithEmailAndPassword = async ({
  email,
  password,
  displayName,
}) => {
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  const credentials = await auth.createUserWithEmailAndPassword(
    email,
    password,
  );

  await credentials.user.updateProfile({ displayName });
  await createProfile({ id: credentials.user.uid, displayName });
};

const signOut = () => auth.signOut();

const useAuthStateChange = effect => {
  useEffect(() => auth.onAuthStateChanged(effect), []);
};

const emitter = mitt();

const STATUS = {
  initialCheck: 'INITIAL_CHECK',
  signedOut: 'SIGNED_OUT',
  signedIn: 'SIGNED_IN',
  anonymous: 'ANONYMOUS',
};

const initialState = {
  status: STATUS.initialCheck,
  currentUser: {},
  emitter,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
};

function UserProvider({ children }) {
  const [state, setState] = useState(initialState);

  const updatePartialState = updater =>
    setState(current => ({ ...current, ...updater(current) }));

  useAuthStateChange(async user => {
    if (user) {
      updatePartialState(() => ({
        currentUser: user,
        status: user.isAnonymous ? STATUS.anonymous : STATUS.signedIn,
      }));

      state.emitter.emit('signed-in', user);
    } else {
      updatePartialState(() => ({
        currentUser: {},
        status: STATUS.signedOut,
      }));

      state.emitter.emit('signed-out');
    }
  });

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider, STATUS };
