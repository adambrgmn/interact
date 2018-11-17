/* eslint-disable */
// Make sure the database is cleared out before this...
const { resolve } = require('path');
const firebase = require('../node_modules/firebase/app');
require('../node_modules/firebase/firestore');

require('dotenv').config({ path: resolve(__dirname, '.env.local') });

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
};

firebase.initializeApp(config);

const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

const sessions = [
  {
    uid: 'ajsnbkjb2JBKj23KJB408BKBsdsAd',
    date_created: firebase.firestore.FieldValue.serverTimestamp(),
    external_id: '1',
    name: 'Foo',
    active: false,
    allow_anonymous: true,
    owner: 'ctratOvLVDahtHN6ihkSakv1Ler2',
    collaborators: ['ctratOvLVDahtHN6ihkSakv1Ler2'],
    questions: ['nljnslfjvLAJnljAljnas876aslk', 'k12loknLKnsdasnko12eNJslkns9'],
  },
];

const questions = [
  {
    uid: 'nljnslfjvLAJnljAljnas876aslk',
    date_created: firebase.firestore.FieldValue.serverTimestamp(),
    user: 'asdIAS877YGhsTg56SHJHS65Ghas',
    body: 'WTF?!',
    votes: 0,
    answered: false,
    in_queue: false,
    removed: false,
    session: 'ajsnbkjb2JBKj23KJB408BKBsdsAd',
  },
  {
    uid: 'k12loknLKnsdasnko12eNJslkns9',
    date_created: firebase.firestore.FieldValue.serverTimestamp(),
    user: 'ohrogh976JHKJHbbhbasre123khk',
    body: 'What is it exactly that you mean?',
    votes: 0,
    answered: false,
    in_queue: false,
    removed: false,
    session: 'ajsnbkjb2JBKj23KJB408BKBsdsAd',
  },
];

const users = [
  {
    uid: 'ctratOvLVDahtHN6ihkSakv1Ler2',
    date_created: firebase.firestore.FieldValue.serverTimestamp(),
    name: 'Adam Bergman',
  },
  {
    uid: 'asdIAS877YGhsTg56SHJHS65Ghas',
    date_created: firebase.firestore.FieldValue.serverTimestamp(),
    name: 'Jane Doe',
  },
  {
    uid: 'ohrogh976JHKJHbbhbasre123khk',
    date_created: firebase.firestore.FieldValue.serverTimestamp(),
    name: 'John Doods',
  },
];

const storeArray = async (collection, array) => {
  console.log(`Creating ${collection}`);
  const ref = db.collection(collection);
  await Promise.all(array.map(({ uid, ...item }) => ref.doc(uid).set(item)));
  console.log(`${collection} created`);
};

(async () => {
  try {
    await Promise.all([
      storeArray('sessions', sessions),
      storeArray('questions', questions),
      storeArray('users', users),
    ]);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
