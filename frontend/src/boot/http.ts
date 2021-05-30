/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { Store } from 'vuex';
import { StoreElements } from '../store';
import { App } from 'vue';
import { Notify } from 'quasar';
import { HttpError } from 'src/store/types';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const api: AxiosInstance = axios.create();

export default boot(
  ({ app, store }: { app: App; store: Store<StoreElements> }) => {
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
          setAuthHeader('');
          void (await store.dispatch('auth/LOGOUT_USER'));

          Notify.create({
            message:
              (error?.response?.data as string) ??
              error?.response?.data?.message,
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
        } else if (error?.response?.status === 403) {
          Notify.create({
            message: 'You are not permitted to perform the requested action',
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
              'Not found',
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
  }
);

export { axios, api };
