import Storage from '../../utils/storage';
import Utils from '../../utils/index';

const app = {
  state: {
    locale: Storage.get('locale')
      || Utils.getLocale(),
  },
  mutations: {
    updateLocale(state, locale) {
      state = Object.assign(state, { /* eslint-disable-line */
        locale,
      });
    },
  },
  actions: {
    setLocale(store, locale) {
      store.commit('updateLocale', locale);
    },
  },
};

export default app;
