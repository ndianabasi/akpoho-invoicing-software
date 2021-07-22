/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { Store } from 'vuex';
import { StoreElements } from '../store';
import { Notify } from 'quasar';
import { HttpError } from 'src/store/types';
import { BootFileParams } from '@quasar/app';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const api: AxiosInstance = axios.create();

export default boot(
  ({ app, store, router }: BootFileParams<Store<StoreElements>>) => {
    api.defaults.baseURL = store.getters.getBaseURL as string;
    api.defaults.timeout = store.getters.getHttpOptions.timeout as number;
    api.defaults.headers = store.getters.getHttpOptions.headers as string;

    app.config.globalProperties.$axios = axios;
    // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
    //       so you won't necessarily have to import axios in each vue file

    app.config.globalProperties.$http = api;
    app.config.globalProperties.$api = api;
    // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
    //       so you can easily perform requests against your app's API

    function setAuthHeader(token: string) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      api.defaults.headers['Authorization'] = token ? `Bearer ${token}` : '';
    }

    store.watch(
      (state, getters) => getters['auth/getToken'] as string,
      (token) => {
        if (token) {
          //console.log('token is set');
          setAuthHeader(token);
        } else {
          //console.log('token is unset');
          setAuthHeader('');
        }
      }
    );

    api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: HttpError) => {
        console.log(error.response);
        if (error?.response?.status === 401) {
          store.commit('auth/LOGOUT_USER');
          void router.push({ name: 'Login' });

          Notify.create({
            message:
              error?.response?.data?.message ??
              typeof error?.response?.data === 'string'
                ? error?.response?.data
                : 'You are not logged in!',
            type: 'negative',
            position: 'top',
            progress: true,
            timeout: 5000,
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          });
        } else if (error?.response?.status === 400) {
          console.log(error.response.data);

          Notify.create({
            message:
              error?.response?.data?.message ??
              (typeof error?.response?.data === 'string'
                ? error?.response?.data
                : 'You made a bad request.'),
            type: 'negative',
            position: 'top',
            progress: true,
            timeout: 5000,
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          });
        } else if (error?.response?.status === 403) {
          Notify.create({
            message:
              'You are not permitted to perform the requested action. Make sure that you are viewing the right company.',
            type: 'negative',
            position: 'top',
            progress: true,
            timeout: 5000,
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          });
        } else if (error?.response?.status === 422) {
          // Intercept validation errors
          const validationErrors = error?.response?.data?.errors;
          if (Array.isArray(validationErrors) && validationErrors.length) {
            const errorListItems: string[] = validationErrors.map(
              (error) => `<li>${error.message}</li>`
            );
            Notify.create({
              message: '<ul>' + errorListItems.join('') + '</ul>',
              html: true,
              type: 'negative',
              position: 'top',
              progress: true,
              timeout: 10000,
              actions: [
                {
                  label: 'Dismiss',
                  color: 'white',
                },
              ],
            });
          }
        } else if (error?.response?.status === 404) {
          Notify.create({
            message:
              error?.response?.data?.message ??
              (error?.response?.data as string) ??
              'Request resource was not found!',
            type: 'negative',
            position: 'top',
            progress: true,
            timeout: 5000,
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          });
        } else if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status >= 500
        ) {
          Notify.create({
            message:
              error?.response?.data?.message ??
              (error?.response?.data as string) ??
              'Internal Server Error',
            type: 'negative',
            position: 'top',
            progress: true,
            timeout: 5000,
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          });
        }

        return Promise.reject(error);
      }
    );

    router.beforeEach((to, _from, next) => {
      const isLoggedIn = store.getters['auth/isLoggedIn'] as boolean;
      if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (isLoggedIn) {
          return next();
        } else {
          Notify.create({
            type: 'negative',
            message: 'You are not logged in.',
            position: 'top',
          });
          return next({ name: 'Login' });
        }
      } else return next();
    });

    router.beforeEach((to, from, next) => {
      const GET_USER_PERMISSION =
        store.getters['permissions/GET_USER_PERMISSION'];
      if (to.meta && !!to.meta.permission) {
        if (GET_USER_PERMISSION(to.meta.permission)) {
          return next();
        } else return next(from);
      } else {
        return next();
      }
    });
  }
);

export { axios, api };
