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
    dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
    externalId: '1',
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
    dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
    user: 'asdIAS877YGhsTg56SHJHS65Ghas',
    body: 'WTF?!',
    votes: [],
    answered: false,
    inQueue: false,
    removed: false,
    session: 'ajsnbkjb2JBKj23KJB408BKBsdsAd',
  },
  {
    uid: 'k12loknLKnsdasnko12eNJslkns9',
    dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
    user: 'ohrogh976JHKJHbbhbasre123khk',
    body: 'What is it exactly that you mean?',
    votes: [],
    answered: false,
    inQueue: false,
    removed: false,
    session: 'ajsnbkjb2JBKj23KJB408BKBsdsAd',
  },
];

const profiles = [
  {
    uid: 'ctratOvLVDahtHN6ihkSakv1Ler2',
    dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
    displayName: 'Adam Bergman',
  },
  {
    uid: 'asdIAS877YGhsTg56SHJHS65Ghas',
    dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
    displayName: 'Jane Doe',
  },
  {
    uid: 'ohrogh976JHKJHbbhbasre123khk',
    dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
    displayName: 'John Doods',
  },
];

const storeArray = async (collection, array) => {
  console.log(`Creating ${collection}`);
  const ref = db.collection(collection);
  await Promise.all(array.map(({ uid, ...item }) => ref.doc(uid).set(item)));
  console.log(`${collection} created`);
};

function deleteCollection(collectionPath, batchSize) {
  console.log(`Removing ${collectionPath}`);
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, batchSize, resolve, reject);
  });
}

function deleteQueryBatch(query, batchSize, resolve, reject) {
  query
    .get()
    .then(snapshot => {
      // When there are no documents left, we are done
      if (snapshot.size == 0) {
        return 0;
      }

      // Delete documents in a batch
      var batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        return snapshot.size;
      });
    })
    .then(numDeleted => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
        deleteQueryBatch(query, batchSize, resolve, reject);
      });
    })
    .catch(reject);
}

(async () => {
  try {
    await Promise.all([
      deleteCollection('sessions', 10),
      deleteCollection('questions', 10),
      deleteCollection('profiles', 10),
    ]);

    await Promise.all([
      storeArray('sessions', sessions),
      storeArray('questions', questions),
      storeArray('profiles', profiles),
    ]);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
