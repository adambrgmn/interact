import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { Status, ApiError } from './error';
import { first } from '../utils';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
};

firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

const collections = {
  sessions: db.collection('sessions'),
  questions: db.collection('questions'),
  users: db.collection('users'),
};

const runTransaction = (ref, updater) =>
  db.runTransaction(async transaction => {
    const doc = await transaction.get(ref);
    if (!doc.exists) throw new Error('Reference does not exist');

    const nextValue = await updater(doc.data());
    transaction.update(ref, nextValue);
  });

async function getSessionById({ id }) {
  try {
    const snapshot = await collections.sessions
      .where('external_id', '==', id)
      .get();

    if (snapshot.size < 1) throw new Error();

    const doc = first(snapshot.docs);
    return { ...doc.data(), id: doc.id };
  } catch (err) {
    throw new ApiError(`Session with id ${id} could not be found`, {
      status: Status.notFound,
    });
  }
}

async function getQuestionsBySessionId({ id }) {
  try {
    const snapshot = await collections.questions
      .where('session', '==', id)
      .orderBy('date_created', 'desc')
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    throw new ApiError(`Questions for session ${id} could not be found`, {
      status: Status.notFound,
    });
  }
}

async function getUserById({ id }) {
  try {
    const snapshot = await collections.users.doc(id).get();
    if (!snapshot.exists) throw new Error();

    return snapshot.data();
  } catch (err) {
    throw new ApiError(`User with id "${id}" could not be found`, {
      status: Status.notFound,
    });
  }
}

async function createUser({ id, displayName }) {
  try {
    const ref = await collections.users.doc(id);
    const user = await ref.get();
    if (user.exists) return;

    await ref.set({
      id,
      displayName: displayName || 'Anonymous',
      date_created: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    throw new ApiError(`Could not create a public user record`);
  }
}

async function incrementVote({ id }) {
  try {
    const docRef = collections.questions.doc(id);
    await runTransaction(docRef, ({ votes }) => ({ votes: votes + 1 }));
  } catch (err) {
    throw new ApiError(`Could not increment votes for question with id ${id}`);
  }
}

export {
  auth,
  db,
  collections,
  getSessionById,
  getQuestionsBySessionId,
  getUserById,
  createUser,
  incrementVote,
};
