export default {
  set(key, value) {
    const json = JSON.stringify(value);
    window.localStorage.setItem(key, json);
  },
  get(key) {
    const json = window.localStorage.getItem(key);
    try {
      return JSON.parse(json);
    } catch (err) {
      return null;
    }
  },
  remove(key) {
    window.localStorage.removeItem(key);
  },
};
