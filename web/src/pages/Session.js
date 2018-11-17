import React from 'react';
import PropTypes from 'prop-types';
import PrintProps from '../components/PrintProps';
import { SessionResource } from '../api/resources';

function Session({ id }) {
  const session = SessionResource.read(id);
  return <PrintProps props={session} />;
}

Session.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Session;
