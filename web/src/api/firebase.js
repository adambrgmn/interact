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
  profiles: db.collection('profiles'),
};

const runTransaction = (ref, updater) =>
  db.runTransaction(async transaction => {
    const doc = await transaction.get(ref);
    if (!doc.exists) throw new Error('Reference does not exist');

    const nextValue = await updater(doc);
    transaction.update(ref, nextValue);
  });

async function getSessionById({ id }) {
  try {
    const snapshot = await collections.sessions
      .where('externalId', '==', id)
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
      .orderBy('dateCreated', 'desc')
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    throw new ApiError(`Questions for session ${id} could not be found`, {
      status: Status.notFound,
    });
  }
}

async function getProfileById({ id }) {
  try {
    const snapshot = await collections.profiles.doc(id).get();
    if (!snapshot.exists) throw new Error();

    return snapshot.data();
  } catch (err) {
    throw new ApiError(`Profile with id "${id}" could not be found`, {
      status: Status.notFound,
    });
  }
}

async function createQuestion({ body, sessionId, userId }) {
  try {
    await collections.questions.add({
      answered: false,
      body,
      dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
      inQueue: false,
      removed: false,
      session: sessionId,
      user: userId,
      votes: [],
    });
  } catch (err) {
    throw new ApiError('Could not create question');
  }
}

async function createProfile({ id, displayName }) {
  try {
    const ref = await collections.profiles.doc(id);
    const user = await ref.get();
    if (user.exists) return;

    await ref.set({
      id,
      displayName: displayName || 'Anonymous',
      dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    throw new ApiError(`Could not create a public profile`);
  }
}

async function incrementVote({ id, userId }) {
  try {
    const ref = collections.questions.doc(id);
    await runTransaction(ref, () => ({
      votes: firebase.firestore.FieldValue.arrayUnion(userId),
    }));
  } catch (err) {
    throw new ApiError(`Could not increment votes for question with id ${id}`);
  }
}

export {
  firebase,
  auth,
  db,
  collections,
  getSessionById,
  getQuestionsBySessionId,
  getProfileById,
  createQuestion,
  createProfile,
  incrementVote,
};
