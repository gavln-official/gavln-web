import Vue from 'vue';
import VueRouter from 'vue-router';

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

export default router;
