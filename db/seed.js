/* eslint-disable no-use-before-define, no-console */
require('dotenv').config({ path: '.env.local' });
require('isomorphic-fetch');
const Listr = require('listr');
const firebase = require('firebase');
require('firebase/firestore');

const db = createDatabase();

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
const serverNow = () => firebase.firestore.FieldValue.serverTimestamp();

(async () => {
  try {
    const collections = [
      ['profiles', item => ({ ...item, dateCreated: serverNow() })],
      [
        'sessions',
        (item, ctx) => ({
          ...item,
          dateCreated: serverNow(),
          owner: ctx.profiles[random(0, ctx.profiles.length - 1)],
        }),
      ],
      [
        'questions',
        (item, ctx) => ({
          ...item,
          dateCreated: serverNow(),
          user: ctx.profiles[random(0, ctx.profiles.length - 1)],
          session: ctx.sessions[random(0, ctx.sessions.length - 1)],
        }),
        false,
      ],
    ];

    const tasks = new Listr(
      [
        {
          title: 'Clear database',
          task: () =>
            new Listr(
              collections.map(([collection]) => ({
                title: capitalize(collection),
                task: () => deleteCollection(collection),
              })),
              { concurrent: true },
            ),
        },
        {
          title: 'Fetch data',
          task: ctx =>
            fetch(process.env.JSON_URL)
              .then(r => r.json())
              .then(data => {
                ctx.data = data;
              }),
        },
        {
          title: 'Seed data',
          task: () =>
            new Listr(collections.map(task => seed(...task)), {
              concurrent: false,
            }),
        },
      ],
      { concurrent: false },
    );

    await tasks.run();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

function seed(name, mapFn, fetchItems = true) {
  return {
    title: capitalize(name),
    task: async ctx => {
      const collection = db.collection(name);
      const arr = ctx.data[name].map(item => mapFn(item, ctx));
      const result = await batchAdd(collection, arr, fetchItems);
      ctx[name] = result;
    },
  };
}

async function batchAdd(collection, arr, fetchItems = true) {
  const batch = db.batch();
  arr.forEach(item => batch.set(collection.doc(), item));
  await batch.commit();

  if (fetchItems) {
    const items = [];
    await collection.get().then(snap => snap.forEach(i => items.push(i.id)));
    return items;
  }

  return [];
}

async function deleteCollection(name, batchSize = 10) {
  const ref = db.collection(name);
  const query = ref.orderBy('__name__').limit(batchSize);

  const deleteQueryBatch = async q => {
    const snapshot = await q.get();
    const { size } = snapshot;
    if (size === 0) return;

    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    await deleteQueryBatch(q);
  };

  await deleteQueryBatch(query);
}

function createDatabase() {
  const config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
  };

  firebase.initializeApp(config);

  const database = firebase.firestore();
  database.settings({ timestampsInSnapshots: true });

  return database;
}
