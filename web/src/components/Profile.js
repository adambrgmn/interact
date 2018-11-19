import PropTypes from 'prop-types';
import { ProfileResource } from '../api/resources';

function Profile({ id, children }) {
  const profile = ProfileResource.read(id);
  return children(profile);
}

Profile.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default Profile;
