/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { store } from 'quasar/wrappers';
import { createStore, GetterTree, Store } from 'vuex';
import { InjectionKey } from 'vue';
import menus from './menus';
import { MenusStateInterface } from './menus/state';
import auth from './auth';
import { AuthStateInterface } from './auth/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

interface RootState {
  baseURL: string;
  rootURL: string;
  gtmID: string;
  httpTimeout: number;
  currentYear: number | null;
  message: AlertInterface;
  tokenRefreshTime: number;
}

export interface StateInterface {
  menus?: MenusStateInterface;
  auth?: AuthStateInterface;
}

interface AlertInterface {
  type: string;
  content: string;
  status: number | null;
  statusText: string;
  activity: string;
}

export interface StoreInterface {
  state: RootState;
  modules: StateInterface;
  getters: GetterTree<RootState, StateInterface>;
}

type StoreElements = RootState & StateInterface;

export const key: InjectionKey<Store<StoreElements>> = Symbol();

export default store(function (/* { ssrContext } */) {
  const Store = createStore<StoreElements>({
    state: () => ({
      baseURL: `${
        process.env.NODE_ENV === 'production'
          ? 'api.xxx.com/v1'
          : '127.0.0.1:3333/v1'
      }`,
      rootURL: `${
        process.env.NODE_ENV === 'production' ? 'api.xxx.com' : '127.0.0.1:3333'
      }`,
      gtmID: `${
        process.env.NODE_ENV === 'production' ? 'GTM-56SGN89' : 'GTM-M7W36ZV'
      }`,
      httpTimeout: process.env.NODE_ENV === 'production' ? 60000 : 30000,
      currentYear: null,
      message: {
        type: '',
        content: '',
        status: null,
        statusText: '',
        activity: '',
      },
      tokenRefreshTime: 120,
    }),
    getters: {
      getHttpProtocol() {
        return window.location.hostname === 'localhost' ||
          process.env.NODE_ENV !== 'production'
          ? 'http://'
          : 'https://';
      },
      getCurrentYear: (state) => state.currentYear,
      getGtmID: (state) => state.gtmID,
      getRootURL: (state, getters) => {
        return `${getters.getHttpProtocol as string}${state.rootURL}`;
      },
      getBaseURL: (state, getters) => {
        return `${getters.getHttpProtocol as string}${state.baseURL}`;
      },
      getHttpTimeout: (state) => state.httpTimeout,
      getHttpOptions: (state, getters) => {
        return {
          baseURL: getters.getBaseURL as string,
          timeout: getters.getHttpTimeout as number,
          headers: {
            Authorization: `Bearer ${getters['auth/getToken'] as string}`,
          },
        };
      },
      getHttpNoAuthOptions: (state, getters) => {
        return {
          baseURL: getters.getBaseURL as string,
          timeout: getters.getHttpTimeout as string,
        };
      },
      getMessage: (state) => state.message,
      getTokenRefreshTime: (state) => state.tokenRefreshTime,
    },
    modules: {
      menus,
      auth,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING,
  });

  return Store;
});
