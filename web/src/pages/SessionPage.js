import React from 'react';
import PropTypes from 'prop-types';
import { SessionResource } from '../api/resources';
import QuestionList from '../components/QuestionList';
import AskQuestion from '../components/AskQuestion';

function SessionPage({ id }) {
  const session = SessionResource.read(id);
  return (
    <main>
      <div>
        <h2>{session.name}</h2>
      </div>

      <AskQuestion sessionId={session.id} />
      <QuestionList sessionId={session.id} />
    </main>
  );
}

SessionPage.propTypes = {
  id: PropTypes.string.isRequired,
};

export default SessionPage;
