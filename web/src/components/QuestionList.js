import React, { useState, useEffect, Suspense } from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import User from './User';
import { QuestionsResource } from '../api/resources';
import * as subscribe from '../api/subscribe';
import { incrementVote } from '../api/firebase';

function QuestionList({ sessionId }) {
  const initialQuestions = QuestionsResource.read(sessionId);
  const [questions, setQuestions] = useState(initialQuestions || []);

  useEffect(
    () => subscribe.toQuestionsBySessionId({ id: sessionId }, setQuestions),
    [sessionId],
  );

  return (
    <div>
      <Suspense fallback={<Loading />}>
        {questions && questions.length > 0 && (
          <ul>
            {questions.map(question => (
              <li key={question.id}>
                <article>
                  <div>
                    <p>{question.body}</p>
                  </div>

                  <footer>
                    <p>
                      User:{' '}
                      <User userId={question.user}>
                        {user => user.name || ''}
                      </User>
                    </p>
                    <p>
                      Votes: {question.votes.length}{' '}
                      <button
                        type="button"
                        onClick={() => incrementVote({ id: question.id })}
                      >
                        Increment votes
                      </button>
                    </p>
                    <p>
                      Answered:{' '}
                      {question.answered ? (
                        <span role="img" aria-label="Answered">
                          ✅
                        </span>
                      ) : (
                        <span role="img" aria-label="Not answered">
                          ❎
                        </span>
                      )}
                    </p>
                  </footer>
                </article>
                <hr />
              </li>
            ))}
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
