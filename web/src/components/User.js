import PropTypes from 'prop-types';
import { UserResource } from '../api/resources';

function User({ userId, children }) {
  const user = UserResource.read(userId);
  return children(user);
}

User.propTypes = {
  userId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default User;
