import React, { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import { UserContext } from '../../contexts/UserContext';
import Form from './Form';
import Tabs from '../Tabs';
import '@reach/dialog/styles.css';

function SignInDialog({ allowAnonymous, onDismiss }) {
  const initalFocusRef = useRef(null);
  const [currentTab, setCurrentTab] = useState('signUp');
  const user = useContext(UserContext);

  const handleSubmit = fn => async values => {
    await fn(values);
  };

  const signUp = async ({ name, email, password }) => {
    const { user: newUser } = await user.createUserWithEmailAndPassword({
      email,
      password,
    });
    await newUser.updateProfile({ displayName: name });
  };

  const signIn = async ({ email, password }) => {
    await user.signInWithEmailAndPassword({ email, password });
  };

  const signInAnon = async () => {
    await user.signInAnonymously();
  };

  return (
    <DialogOverlay
      isOpen
      onDismiss={() => {
        if (onDismiss) onDismiss();
      }}
    >
      <DialogContent>
        <div>
          <button type="button" onClick={() => setCurrentTab('signUp')}>
            Sign up
          </button>
          <button type="button" onClick={() => setCurrentTab('signIn')}>
            Sign in
          </button>
          {allowAnonymous && (
            <button type="button" onClick={() => setCurrentTab('signInAnon')}>
              Sign in anonymously
            </button>
          )}
        </div>

        <div>
          <Tabs currentTab={currentTab} initialFocusRef={initalFocusRef}>
            <Form
              tab="signUp"
              ref={initalFocusRef}
              title="Sign up"
              fields={['name', 'email', 'password']}
              onSubmit={handleSubmit(signUp)}
            />

            <Form
              tab="signIn"
              ref={initalFocusRef}
              title="Sign in"
              fields={['email', 'password']}
              onSubmit={handleSubmit(signIn)}
            />

            {allowAnonymous && (
              <Form
                tab="signInAnon"
                ref={initalFocusRef}
                title="Sign in anonymously"
                fields={[]}
                onSubmit={handleSubmit(signInAnon)}
              />
            )}
          </Tabs>
        </div>
      </DialogContent>
    </DialogOverlay>
  );
}

SignInDialog.propTypes = {
  allowAnonymous: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func,
};

export default SignInDialog;
