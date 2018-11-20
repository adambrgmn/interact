import React, { lazy, useState, useEffect, useContext, Suspense } from 'react';
import mitt from 'mitt';
import { UserContext } from '../../contexts/UserContext';
import Loading from '../Loading';

const signInEmitter = mitt();

const Dialog = lazy(() => import('./Dialog'));

function SignIn() {
  const user = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [allowAnonymousSignIn, setAllowAnonymous] = useState(false);

  useEffect(() => {
    const openDialog = ({ allowAnonymous = false } = {}) => {
      setOpen(true);
      setAllowAnonymous(allowAnonymous);
    };
    const closeDialog = () => setOpen(false);

    user.emitter.on('sign-in', openDialog);
    user.emitter.on('signed-in', closeDialog);

    return () => {
      user.emitter.off('sign-in', openDialog);
      user.emitter.off('signed-in', closeDialog);
    };
  }, []);

  const handleDismiss = () => setOpen(false);

  return open ? (
    <Suspense fallback={<Loading />}>
      <Dialog allowAnonymous={allowAnonymousSignIn} onDismiss={handleDismiss} />
    </Suspense>
  ) : null;
}

export { SignIn as default, signInEmitter };
