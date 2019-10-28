import Vue from 'vue';

import router from './router';
import store from './store';

import App from './app/index.vue';

import './style/base.scss';
// Element-UI custom theme
import './style/theme/index.css';
// Element-UI reset styles
import './style/reset/index.scss';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
