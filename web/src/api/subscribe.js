import { collections } from './firebase';

const toQuestionsBySessionId = ({ id }, onUpdate, onError) => {
  const unsubscribe = collections.questions
    .where('session', '==', id)
    .orderBy('dateCreated', 'desc')
    .onSnapshot(snap => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      onUpdate(data);
    }, onError);

  return unsubscribe;
};

const toProfileUpdates = ({ id }, onUpdate, onError) => {
  const unsubscribe = collections.profiles.doc(id).onSnapshot(doc => {
    const data = { id: doc.id, ...doc.data() };
    onUpdate(data);
  }, onError);

  return unsubscribe;
};

export { toQuestionsBySessionId, toProfileUpdates };
