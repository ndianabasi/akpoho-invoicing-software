/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';

/* const actions = {
  ...mapActions('auth', ['logoutUser']),
};
const logoutUser = actions.logoutUser; */

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function ({ store /* ssrContext */ }) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const createHistory =
    process.env.MODE === 'ssr'
      ? createMemoryHistory
      : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

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

  return Router;
});
