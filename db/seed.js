/* eslint-disable no-use-before-define, no-console */
require('dotenv').config({ path: '.env.local' });
require('isomorphic-fetch');
const Listr = require('listr');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});

const auth = admin.auth();
const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
const serverNow = () => admin.firestore.FieldValue.serverTimestamp();

(async () => {
  try {
    /**
     * These collection are the basic collections in our database
     * [0] = name in data fetched from the json generator
     * [1] = A mapping function to transform the data from the json generator into something useful
     * [2] = Wether to actually get the newly created items ids and place them on ctx
     */
    const collections = [
      [
        'profiles',
        item => ({ displayName: item.displayName, dateCreated: serverNow() }),
        true,
      ],
      [
        'sessions',
        (item, ctx) => ({
          ...item,
          externalId: `${item.externalId}`,
          dateCreated: serverNow(),
          owner: ctx.profiles[random(0, ctx.profiles.length - 1)],
        }),
        true,
      ],
      [
        'questions',
        (item, ctx) => ({
          ...item,
          dateCreated: serverNow(),
          user: ctx.profiles[random(0, ctx.profiles.length - 1)],
          session: ctx.sessions[random(0, ctx.sessions.length - 1)],
          votes: [],
        }),
        false,
      ],
    ];

    const tasks = new Listr(
      [
        {
          /**
           * The first task will clear the database of all entries and also
           * clear all users registered.
           */
          title: 'Clear database',
          task: () =>
            new Listr(
              collections
                .map(([collection]) => ({
                  title: capitalize(collection),
                  task: () => deleteCollection(collection),
                }))
                .concat({
                  title: 'Users',
                  task: () => clearUsers(),
                }),
              { concurrent: true },
            ),
        },
        {
          /**
           * This task will fetch data from next.json-generator.com/${id}. The
           * should be placed on process.env.JSON_URL.
           * This data is then placed on the context object provided by Listr
           * and follow along all the way
           */
          title: 'Fetch data',
          task: ctx =>
            fetch(process.env.JSON_URL)
              .then(r => r.json())
              .then(data => {
                ctx.data = data;
              }),
        },
        {
          /**
           * Users are created from the profiles prop which comes from the data
           * fetched from json-generator.
           * The newly created users then replaces the old profiles prop so that
           * the ids can be used when creating the profiles records in the
           * database.
           *
           * The profiles records are necessary since the data stored on users
           * aren't publicly available, but the app needs display names to
           * show whos asking a question and such things.
           */
          title: 'Create users',
          task: async ctx => {
            const { profiles } = ctx.data;
            const users = await Promise.all(
              profiles.map(({ email, displayName }) =>
                auth.createUser({ email, displayName }),
              ),
            );

            ctx.data.profiles = users.map(u => ({
              id: u.uid,
              ...u.toJSON(),
            }));
          },
        },
        {
          /**
           * Finally transform the data from json-generator (and the newly
           * created users) and put it in collections on the database
           */
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

/**
 * Seed takse the name of a collection (profiles, sessions, questions) and maps
 * over the data from the context and finally makes a batch creation into the
 * database.
 */
function seed(name, mapFn, fetchItems = true) {
  return {
    title: capitalize(name),
    task: async ctx => {
      const collection = db.collection(name);

      const items = ctx.data[name];
      const arr = items.map(item => mapFn(item, ctx));
      const result = await batchAdd(
        collection,
        arr,
        items.map(i => i.id),
        fetchItems,
      );

      ctx[name] = result;
    },
  };
}

/**
 * Batch add takes a collection together with an array of items to insert into
 * that collection.
 * The function also accepts an array of ids to use when creating the new
 * records – this is mainly used to create profile records which needs to
 * have a corresponding id with the users in the users database.
 * If the id == null a new record will be created with a random id.
 *
 * By default batchAdd also fetches all the newly created documents and returns
 * the ids. These ids are used to refer to recirds inside other collections.
 */
async function batchAdd(collection, arr, ids = [], fetchItems = true) {
  const batch = db.batch();
  arr.forEach((item, i) => {
    const coll = ids[i] ? collection.doc(ids[i]) : collection.doc();
    batch.set(coll, item);
  });
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

async function clearUsers(batchSize = 5, token) {
  const records = await auth.listUsers(batchSize, token);
  await Promise.all(records.users.map(user => auth.deleteUser(user.uid)));

  if (records.pageToken) return clearUsers(batchSize, records.pageToken);
  return null;
}
