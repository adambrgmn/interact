import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ProfileResource } from '../api/resources';
import * as subscribe from '../api/subscribe';

function Profile({ id, children }) {
  const initialProfile = ProfileResource.read(id);

  const [profile, setProfile] = useState(() => initialProfile);
  useEffect(() => subscribe.toProfileUpdates({ id }, setProfile), [id]);

  return children(profile);
}

Profile.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default Profile;
