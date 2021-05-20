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

let apiNoAuth: AxiosInstance;
export default boot(
  ({ app, store }: { app: App; store: Store<StoreElements> }) => {
    apiNoAuth = axios.create({
      timeout: store.getters.getHttpNoAuthOptions.timeout as number,
      baseURL: store.getters.getHttpNoAuthOptions.baseURL as string,
    });
    // for use inside Vue files (Options API) through this.$axios and this.$api

    app.config.globalProperties.$axiosNoAuth = axios;
    // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
    //       so you won't necessarily have to import axios in each vue file

    app.config.globalProperties.$httpNoAuth = apiNoAuth;
    app.config.globalProperties.$apiNoAuth = apiNoAuth;
    // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
    //       so you can easily perform requests against your app's API

    apiNoAuth.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: HttpError) => {
        //console.log(error.response);
        if (error?.response?.status === 401) {
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
        }

        return Promise.reject(error);
      }
    );
  }
);

export { axios, apiNoAuth };
