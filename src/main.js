import Vue from 'vue';
import Element from 'element-ui';

import router from './router';
import store from './store';
import filters from './filters/index';
import i18n from './i18n';

import App from './app/index.vue';

import './style/base.scss';
// Element-UI custom theme
import './style/theme/index.css';
// Element-UI reset styles
import './style/reset/index.scss';

// VueContext custom style
import './style/vue-context.scss';

Vue.use(Element);
Vue.use(filters);
Vue.prototype.$t = (key, config) => i18n.t(key, config);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
