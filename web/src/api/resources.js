import { unstable_createResource as createResource } from 'react-cache';
import * as fb from './firebase';

const safeAsync = (asyncFn, defaultReturn = null) => async (...args) => {
  try {
    const response = await asyncFn(...args);
    return response;
  } catch (err) {
    return defaultReturn;
  }
};

const SessionResource = createResource(
  safeAsync(id => fb.getSessionById({ id })),
);

const QuestionsResource = createResource(
  safeAsync(id => fb.getQuestionsBySessionId({ id })),
);

const UserResource = createResource(safeAsync(id => fb.getUserById({ id })));

export { SessionResource, QuestionsResource, UserResource };
