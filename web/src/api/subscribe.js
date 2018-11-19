import { collections } from './firebase';

const toQuestionsBySessionId = ({ id }, onUpdate, onError) => {
  const unsubscribe = collections.questions
    .where('session', '==', id)
    .orderBy('date_created', 'desc')
    .onSnapshot(
      snap => {
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        onUpdate(data);
      },
      error => {
        if (onError) onError(error);
      },
    );

  return unsubscribe;
};

export { toQuestionsBySessionId };
