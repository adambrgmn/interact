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

const createUserWithEmailAndPassword = ({ email, password }) => {
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  return auth.createUserWithEmailAndPassword(email, password);
};

const signOut = () => auth.signOut();

const useAuthStateChange = effect => {
  useEffect(() => auth.onAuthStateChanged(effect), []);
};

const emitter = mitt();

const STATUS = {
  signedOut: 'SIGNED_OUT',
  signedIn: 'SIGNED_IN',
  anonymous: 'ANONYMOUS',
};

function UserProvider({ children }) {
  const [state, setState] = useState({
    status: STATUS.signedOut,
    currentUser: {},
    emitter,
    signInAnonymously,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
  });

  const updatePartialState = updater =>
    setState(current => ({ ...current, ...updater(current) }));

  useAuthStateChange(async user => {
    if (user) {
      await createProfile({ id: user.uid, ...user });

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

      state.emitter.emit('signed-out', user);
    }
  });

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider, STATUS };
