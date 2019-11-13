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

export default {
  set,
  get,
  remove,
};
