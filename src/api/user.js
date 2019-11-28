import HTTP from './http';
import Utils from '../utils/index';

function checkUsername(username) {
  const data = new FormData();
  data.append('name', username);

  return HTTP({
    method: 'POST',
    url: '/user/exists',
    data,
  });
}

function register(username, password, email) {
  const data = new FormData();
  data.append('name', username);
  data.append('pass', Utils.encodePassword(password));
  if (email) {
    data.append('mail', email);
  }

  return HTTP({
    method: 'POST',
    url: '/user/registry',
    data,
  });
}

export default {
  checkUsername,
  register,
};
