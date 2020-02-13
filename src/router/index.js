import Vue from 'vue';
import VueRouter from 'vue-router';
import {
  Notification,
} from 'element-ui';

import i18n from '../i18n';

import Storage from '../utils/storage';
import Utils from '../utils/index';

import Home from '../pages/home/index.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      login: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/login/index.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../pages/register.vue'),
  },
  {
    path: '/reset',
    name: 'reset',
    component: () => import('../pages/reset.vue'),
  },
  {
    path: '/s/:rand',
    name: 'open-share',
    component: () => import('../pages/open-share/index.vue'),
  },
  {
    path: '/favorite',
    name: 'favorite',
    component: () => import('../pages/favorite.vue'),
    meta: {
      login: true,
    },
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('../pages/upload/index.vue'),
    meta: {
      login: true,
    },
  },
  {
    path: '/download',
    name: 'download',
    component: () => import('../pages/download.vue'),
    meta: {
      login: true,
    },
  },
  {
    path: '/finished',
    name: 'finished',
    component: () => import('../pages/finished.vue'),
    meta: {
      login: true,
    },
  },
  {
    path: '/share',
    name: 'share',
    component: () => import('../pages/share.vue'),
    meta: {
      login: true,
    },
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../pages/search/index.vue'),
    meta: {
      login: true,
    },
  },
  {
    path: '/trash',
    name: 'trash',
    component: () => import('../pages/trash.vue'),
    meta: {
      login: true,
    },
  },
  {
    path: '/article/:name',
    name: 'article',
    component: () => import('../pages/article/index.vue'),
  },
  {
    path: '*',
    redirect: '/',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const everVisited = Storage.get('ever-visited');
  const locale = Storage.get('locale');

  Notification.closeAll();

  if (!everVisited) {
    Notification({
      showClose: false,
      duration: 0,
      position: 'bottom-right',
      dangerouslyUseHTMLString: true,
      message: `
        <div class="cookie-notification">
          <p>${i18n.t('cookie-notification.message')}</p>
          <p>
            <span>${i18n.t('cookie-notification.please-read')}</span><a href="/">${i18n.t('privacy')}</a><span>${i18n.t('cookie-notification.for-more-infomation')}</span>
          </p>
          <button type="button" class="el-button el-button--primary">${i18n.t('ok')}</button>
        </div>
      `,
      onClick: () => {
        Storage.set('ever-visited', true);
        Notification.closeAll();
      },
    });
  }

  if (!locale) {
    Storage.set('locale', Utils.getLocale());
  }

  const hasLogin = Storage.getToken();

  // redirect to /login
  if (to.meta
      && to.meta.login
      && !hasLogin) {
    Storage.clearAuthInfo();

    next({
      name: 'login',
      query: {
        redirect: to.path,
      },
    });
  }

  next();
});

export default router;
