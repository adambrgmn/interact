import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../contexts/UserContext';
import { createQuestion } from '../api/firebase';

function AskQuestion({ sessionId }) {
  const [state, setState] = useState('idle');
  const [question, setQuestion] = useState('');
  const { currentUser } = useContext(UserContext);

  const addQuestion = async () => {
    try {
      setState('submitting');
      await createQuestion({
        body: question,
        sessionId,
        userId: currentUser.uid,
      });

      setState('idle');
      setQuestion('');
    } catch (err) {
      // void
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    addQuestion();
  };

  const textareaDisabled = state === 'submitting';
  const buttonDisabled = question.length < 1 || state === 'submitting';

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="question">
            <span>Your question</span>
            <textarea
              id="question"
              name="question"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              readOnly={textareaDisabled}
              disabled={textareaDisabled}
            />
          </label>
        </div>

        <div>
          <button type="submit" disabled={buttonDisabled}>
            Submit question
          </button>
          <button
            type="button"
            onClick={() => setQuestion('')}
            disabled={buttonDisabled}
          >
            Clear question
          </button>
        </div>
      </form>
    </div>
  );
}

AskQuestion.propTypes = {
  sessionId: PropTypes.string.isRequired,
};

export default AskQuestion;
