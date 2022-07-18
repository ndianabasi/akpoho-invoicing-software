/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { boot } from 'quasar/wrappers';
import { Notify, Loading, QSpinnerHourglass } from 'quasar';

export default boot(({ store, router }) => {
  router.beforeEach((to, _from, next) => {
    const isLoggedIn = store.getters['auth/isLoggedIn'] as boolean;
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (isLoggedIn) {
        next();
      } else {
        Notify.create({
          type: 'negative',
          message: 'You are not logged in.',
          position: 'top',
        });
        next({ name: 'Login' });
      }
    } else next();
  });

  router.beforeEach((to, from, next) => {
    const GET_USER_PERMISSION =
      store.getters['permissions/GET_USER_PERMISSION'];
    if (to.meta && !!to.meta.permission) {
      if (GET_USER_PERMISSION(to.meta.permission)) {
        next();
      } else {
        Notify.create({
          type: 'negative',
          message: 'Navigation is not permitted.',
          position: 'top',
        });
        next(false);
      }
    } else {
      next();
    }
  });

  router.beforeEach(() => {
    Loading.show({ spinner: QSpinnerHourglass });
  });

  router.afterEach(() => {
    Loading.hide();
  });
});
