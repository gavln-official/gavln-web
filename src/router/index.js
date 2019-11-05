import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../pages/home/index.vue';
import Login from '../pages/login/index.vue';

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
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: Login,
  },
  {
    path: '/favorite',
    name: 'favorite',
    component: () => import(/* webpackChunkName: "favorite" */ '../pages/favorite.vue'),
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import(/* webpackChunkName: "upload" */ '../pages/upload/index.vue'),
  },
  {
    path: '/download',
    name: 'download',
    component: () => import(/* webpackChunkName: "download" */ '../pages/download.vue'),
  },
  {
    path: '/finished',
    name: 'finished',
    component: () => import(/* webpackChunkName: "finished" */ '../pages/finished.vue'),
  },
  {
    path: '/share',
    name: 'share',
    component: () => import(/* webpackChunkName: "share" */ '../pages/share.vue'),
  },
  {
    path: '/trash',
    name: 'trash',
    component: () => import(/* webpackChunkName: "trash" */ '../pages/trash.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
