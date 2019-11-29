import JsCookie from 'js-cookie';

function set(key, value) {
  JsCookie.set(key, value);
}

function get(key) {
  return JsCookie.get(key);
}

function remove(key) {
  JsCookie.remove(key);
}

function getToken() {
  return get('access_token');
}

function clearAuthInfo() {
  remove('access_token');
  remove('refresh_token');
  remove('token_expires_at');
}

export default {
  set,
  get,
  remove,
  getToken,
  clearAuthInfo,
};
