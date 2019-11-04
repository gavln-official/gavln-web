import Vue from 'vue';

import router from './router';
import store from './store';
import filters from './filters/index';

import App from './app/index.vue';

import './style/base.scss';
// Element-UI custom theme
import './style/theme/index.css';
// Element-UI reset styles
import './style/reset/index.scss';

Vue.use(filters);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
