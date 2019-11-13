import Vue from 'vue';
import VueRouter from 'vue-router';
import {
  Notification,
} from 'element-ui';

import Storage from '../utils/storage';

import Home from '../pages/home/index.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
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
    path: '/s/:shareId',
    name: 'open-share',
    component: () => import('../pages/open-share/index.vue'),
  },
  {
    path: '/favorite',
    name: 'favorite',
    component: () => import('../pages/favorite.vue'),
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('../pages/upload/index.vue'),
  },
  {
    path: '/download',
    name: 'download',
    component: () => import('../pages/download.vue'),
  },
  {
    path: '/finished',
    name: 'finished',
    component: () => import('../pages/finished.vue'),
  },
  {
    path: '/share',
    name: 'share',
    component: () => import('../pages/share.vue'),
  },
  {
    path: '/trash',
    name: 'trash',
    component: () => import('../pages/trash.vue'),
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

  if (!everVisited) {
    Notification({
      showClose: false,
      duration: 0,
      position: 'bottom-right',
      dangerouslyUseHTMLString: true,
      message: `
        <div class="cookie-notification">
          <p>我们使用cookie来确保您在我们的网站上获得最佳的体验。</p>
          <p>
            <span>请阅读我们的</span><a href="/">隐私政策</a><span>以了解更多的信息。</span>
          </p>
          <button type="button" class="el-button el-button--primary">好</button>
        </div>
      `,
      onClick: () => {
        Storage.set('ever-visited', true);
        Notification.closeAll();
      },
    });
  }

  next();
});

export default router;
