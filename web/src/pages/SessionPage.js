import React from 'react';
import PropTypes from 'prop-types';
import { SessionResource } from '../api/resources';
import QuestionList from '../components/QuestionList';

function SessionPage({ id }) {
  const session = SessionResource.read(id);
  return (
    <main>
      <div>
        <h2>{session.name}</h2>
      </div>

      <QuestionList sessionId={session.id} />
    </main>
  );
}

SessionPage.propTypes = {
  id: PropTypes.string.isRequired,
};

export default SessionPage;
