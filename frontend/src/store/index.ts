/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
//import { store } from 'quasar/wrappers';
import {
  createStore,
  GetterTree,
  useStore as baseUseStore,
  Store,
  MutationTree,
} from 'vuex';
import { InjectionKey } from 'vue';

import { RootState, AlertInterface } from './types/index';

import auth from './auth';
import { AuthStateInterface } from './auth/state';
import { AuthGettersInterface } from './auth/getters';

import customers from './customers';
import { CustomersStateInterface } from './customers/state';
import { CustomersGetterInterface } from './customers/getters';

import menus from './menus';
import { MenusStateInterface } from './menus/state';
import { MenusGettersInterface } from './menus/getters';

import quasar_tables from './quasar_tables';
import { QuasarTableStateInterface } from './quasar_tables/state';
import { QuasarTableGetterInterface } from './quasar_tables/getters';

import users from './users';
import { UsersStateInterface } from './users/state';
import { UsersGetterInterface } from './users/getters';

import countries_states from './countries_states';
import { CountriesStatesStateInterface } from './countries_states/state';
import { CountriesStatesGetterInterface } from './countries_states/getters';

import roles from './roles';
import { RolesStateInterface } from './roles/state';
import { RolesGetterInterface } from './roles/getters';

import permissions from './permissions';
import { PermissionStateInterface } from './permissions/state';
import { PermissionGettersInterface } from './permissions/getters';

import banners from './banners';
import { BannerStateInterface } from './banners/state';
import { BannerGettersInterface } from './banners/getters';

import companies from './companies';
import { CompanyStateInterface } from './companies/state';
import { CompanyGetterInterface } from './companies/getters';

import products from './products';
import { ProductStateInterface } from './products/state';
import { ProductGetterInterface } from './products/getters';

import attributes from './attributes';
import { AttributeStateInterface } from './attributes/state';
import { AttributesGettersInterface } from './attributes/getters';

//import { createLogger } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import SecureLS from 'secure-ls';
const ls = new SecureLS({ isCompression: false });

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

type HttpOptions = {
  baseURL: string;
  timeout: number;
  headers?: { Authorization: string };
};

interface RootGetterInterface {
  getHttpProtocol: (state: StoreElements) => string;
  getCurrentYear: (state: StoreElements) => number;
  getGtmID: (state: StoreElements) => number;
  getRootURL: (state: StoreElements) => string;
  getBaseURL: (state: StoreElements) => string;
  getHttpTimeout: (state: StoreElements) => number;
  getHttpOptions: (
    state: StoreElements,
    getters: RootGetterInterface
  ) => HttpOptions;
  getHttpNoAuthOptions: (
    state: StoreElements,
    getters: RootGetterInterface
  ) => HttpOptions;
  getMessage: (state: StoreElements) => AlertInterface;
  getTokenRefreshTime: (state: StoreElements) => number;
  GET_OFFLINE_MODE: (state: StoreElements) => boolean;
}

export interface StateInterface {
  menus?: MenusStateInterface;
  auth?: AuthStateInterface;
  customers?: CustomersStateInterface;
  quasar_tables?: QuasarTableStateInterface;
  users?: UsersStateInterface;
  countries_states?: CountriesStatesStateInterface;
  roles?: RolesStateInterface;
  permissions?: PermissionStateInterface;
  banners?: BannerStateInterface;
  companies?: CompanyStateInterface;
  products?: ProductStateInterface;
  attributes?: AttributeStateInterface;
}

export interface StoreGettersInterface {
  menus?: MenusGettersInterface;
  auth?: AuthGettersInterface;
  customers?: CustomersGetterInterface;
  quasar_tables?: QuasarTableGetterInterface;
  users?: UsersGetterInterface;
  countries_states?: CountriesStatesGetterInterface;
  roles?: RolesGetterInterface;
  permissions?: PermissionGettersInterface;
  banners?: BannerGettersInterface;
  companies?: CompanyGetterInterface;
  products?: ProductGetterInterface;
  attributes?: AttributesGettersInterface;
}

export type StoreGetters = RootGetterInterface & StoreGettersInterface;

export type StoreElements = RootState & StateInterface;
export interface StoreInterface {
  strict?: boolean;
  state: RootState;
  modules: StateInterface;
  getters: GetterTree<RootState, StateInterface>;
  mutations: MutationTree<RootState>;
}

// define your own `useStore` composition function
export function useStore() {
  const key: InjectionKey<Store<StoreElements>> = Symbol('akpoho_store_symbol');
  return baseUseStore(key);
}

let store: Store<StoreElements>;

export default function () {
  store = createStore<StoreElements>({
    strict: process.env.NODE_ENV !== 'production',
    state: function () {
      return {
        apiHost: process.env.API_HOST ?? '127.0.0.1',
        apiPort: process.env.API_PORT ?? '4444',
        apiVersion: 'v1',
        apiProtocol:
          window.location.hostname === 'localhost'
            ? 'http://'
            : ['staging', 'production'].includes(process.env.NODE_ENV)
            ? 'https://'
            : 'http://',
        gtmID: `${process.env.NODE_ENV === 'production' ? '' : ''}`,
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
        darkMode: false,
        isOffline: false,
      };
    },

    mutations: {
      SET_DARK_MODE: (state, payload: boolean) => (state.darkMode = payload),
      SET_OFFLINE: (state, payload: boolean) => (state.isOffline = payload),
    },

    getters: {
      getHttpProtocol: (state) => state.apiProtocol,
      getCurrentYear: (state) => state.currentYear,
      getGtmID: (state) => state.gtmID,
      getRootURL: (state) => {
        return `${state.apiProtocol}${state.apiHost}:${state.apiPort}`;
      },
      getBaseURL: (state) => {
        return `${state.apiProtocol}${state.apiHost}:${state.apiPort}/${state.apiVersion}`;
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
      GET_DARK_MODE: (state) => state.darkMode,
      GET_OFFLINE_MODE: (state) => state.isOffline,
    },

    modules: {
      menus,
      auth,
      customers,
      quasar_tables,
      users,
      countries_states,
      roles,
      permissions,
      banners,
      companies,
      products,
      attributes,
    },

    plugins:
      process.env.NODE_ENV !== 'production'
        ? [createPersistedState()]
        : [
            createPersistedState({
              storage: {
                getItem: (key) => ls.get(key),
                setItem: (key, value) => ls.set(key, value),
                removeItem: (key) => ls.remove(key),
              },
            }),
          ],
  });

  return store;
}

export { store };
