/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
//import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes /* CustomRouteRecord */ from './routes';
//import qs from 'qs';
import { store } from '../store/index';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function () {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const createHistory =
    process.env.MODE === 'ssr'
      ? createMemoryHistory
      : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition;
      } else if (to.hash) {
        return {
          el: to.hash,
          behavior: 'smooth',
        };
      } else {
        return { left: 0, top: 0 };
      }
    },
    routes,
    /* parseQuery: qs.parse,
    stringifyQuery: qs.stringify, */

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  Router.beforeEach(async (to, _from, next) => {
    const isLoggedIn = store.getters['auth/isLoggedIn'] as boolean;
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (isLoggedIn) {
        next();
      } else {
        await store.dispatch('auth/logoutUser', {
          message: 'You are not logged in!',
        });
        await Router.push({ name: 'Login' });
        next();
      }
    } else next();
  });

  Router.beforeEach((to, from, next) => {
    const GET_USER_PERMISSION =
      store.getters['permissions/GET_USER_PERMISSION'];
    if (to.meta && !!to.meta.permission) {
      if (GET_USER_PERMISSION(to.meta.permission)) {
        next();
        return;
      } else from;
    } else {
      next();
      return;
    }
  });

  return Router;
}
