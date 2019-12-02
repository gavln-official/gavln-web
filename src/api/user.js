import HTTP from './http';
import Utils from '../utils/index';
import Storage from '../utils/storage';

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

function login(username, password) {
  return new Promise((resolve, reject) => {
    const data = new FormData();
    data.append('name', username);
    data.append('pass', Utils.encodePassword(password));

    HTTP({
      method: 'POST',
      url: '/user/login',
      data,
    })
      .then((res) => {
        Storage.set('access_token', res.data.access_token);
        Storage.set('refresh_token', res.data.refresh_token);
        Storage.set('token_expires_at', res.data.expires * 1000);

        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getProfile() {
  return HTTP({
    method: 'get',
    url: '/user/getUserInfo',
  });
}

function logOut() {
  return HTTP({
    method: 'POST',
    url: '/user/logout',
  });
}

function sendRetrieve(username, email) {
  const data = new FormData();
  data.append('name', username);
  data.append('mail', email);

  return HTTP({
    method: 'POST',
    url: '/user/sendRetrieve',
    data,
  });
}

export default {
  checkUsername,
  register,
  login,
  getProfile,
  logOut,
  sendRetrieve,
};
