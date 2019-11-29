import UserAPI from '../../api/user';

const user = {
  state: {},
  mutations: {
    updateUserInfo(state, data) {
      state = Object.assign(state, data); /* eslint-disable-line */
    },
  },
  actions: {
    getProfile(store, refresh) {
      return new Promise((resolve, reject) => {
        if (store.state.id
            && !refresh) {
          resolve(store.state);
        } else {
          UserAPI.getProfile()
            .then((res) => {
              const info = res.data;

              store.commit('updateUserInfo', info);
              resolve(info);
            })
            .catch((error) => {
              reject(error);
            });
        }
      });
    },
  },
};

export default user;
