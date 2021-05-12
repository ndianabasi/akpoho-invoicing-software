/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { Store } from 'vuex';
import { StoreElements } from '../store';
import { App } from 'vue';

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
  }
);

export { axios, api };
