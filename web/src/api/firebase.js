import firebase from 'firebase/app';
import 'firebase/firestore';
import { Status, ApiError } from './error';
import { first } from '../utils';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
};

firebase.initializeApp(config);

const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

const collections = {
  sessions: db.collection('sessions'),
  questions: db.collection('questions'),
  users: db.collection('users'),
};

async function getSessionById({ id }) {
  try {
    const snap = await collections.sessions
      .where('external_id', '==', id)
      .get();

    if (snap.size < 1) throw new Error();

    const doc = first(snap.docs);
    return { ...doc.data(), id: doc.id };
  } catch (err) {
    throw new ApiError(`Session with id ${id} could not be found`, {
      status: Status.notFound,
    });
  }
}

export { getSessionById };
