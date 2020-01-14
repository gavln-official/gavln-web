import Vue from 'vue';
import VueI18n from 'vue-i18n';

import en from './locales/en';
import cn from './locales/cn';

import Storage from './utils/storage';

Vue.use(VueI18n);

const messages = {
  en,
  cn,
};

export default new VueI18n({
  locale: Storage.get('locale')
    || 'cn',
  fallbackLocale: 'en',
  messages,
});
