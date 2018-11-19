import React, { useState, useEffect, useContext, Suspense } from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import Profile from './Profile';
import { QuestionsResource } from '../api/resources';
import * as subscribe from '../api/subscribe';
import { incrementVote } from '../api/firebase';
import { UserContext } from '../contexts/UserContext';

function QuestionList({ sessionId }) {
  const initialQuestions = QuestionsResource.read(sessionId);
  const [questions, setQuestions] = useState(initialQuestions);
  const { currentUser } = useContext(UserContext);

  useEffect(
    () => subscribe.toQuestionsBySessionId({ id: sessionId }, setQuestions),
    [sessionId],
  );

  return (
    <div>
      <Suspense fallback={<Loading />}>
        {questions && questions.length > 0 && (
          <ul>
            {questions.map(question => {
              const usersQuestion = question.user === currentUser.uid;
              const alreadyVoted = question.votes.includes(currentUser.uid);

              return (
                <li key={question.id}>
                  <article>
                    <div>
                      <p>{question.body}</p>
                    </div>

                    <footer>
                      <p>
                        User:{' '}
                        <Profile id={question.user}>
                          {profile => (
                            <>
                              <span>{profile.displayName || ''}</span>{' '}
                              {usersQuestion && <span>(me)</span>}
                            </>
                          )}
                        </Profile>
                      </p>
                      <p>
                        Votes: {question.votes.length}{' '}
                        <button
                          type="button"
                          onClick={() =>
                            incrementVote({
                              id: question.id,
                              userId: currentUser.uid,
                            })
                          }
                          disabled={alreadyVoted || usersQuestion}
                        >
                          Increment votes
                        </button>
                      </p>
                    </footer>
                  </article>
                  <hr />
                </li>
              );
            })}
          </ul>
        )}
      </Suspense>
    </div>
  );
}

QuestionList.propTypes = {
  sessionId: PropTypes.string.isRequired,
};

export default QuestionList;
