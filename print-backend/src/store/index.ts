import { InjectionKey } from 'vue';
import {
  createStore,
  GetterTree,
  MutationTree,
  Store,
  Store as VuexStore,
  useStore as vuexUseStore,
} from 'vuex';

import invoices_quotations from './invoices_quotations';
import { InvoiceQuotationStateInterface } from './invoices_quotations/state';
import { store } from 'quasar/wrappers';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  invoices_quotations: InvoiceQuotationStateInterface;
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>;
  }
}

declare module 'vuex' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  interface Store<S> {
    provide<T>(name: string, service: T): void;
    inject<T>(name: string): T | undefined;
  }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<StateInterface>> =
  Symbol('vuex-key');

export interface RootState {
  apiProtocol: string;
  apiHost: string;
}

export interface StoreRootInterface {
  strict?: boolean;
  state?: RootState;
  modules?: StateInterface;
  getters?: GetterTree<RootState, StateInterface>;
  mutations?: MutationTree<RootState>;
}

export type StoreState = RootState & StateInterface;

let vuexStore: Store<StoreState>;

export default store(function (/* { ssrContext } */) {
  vuexStore = createStore<StoreState>({
    /* state: function () {
      return {};
    }, */
    getters: {
      getRootURL: () => {
        let host: string;
        let port: number;

        if (process.env.DEV) {
          host = process.env.DEV_API_SERVER_HOST ?? '';
          port = Number(process.env.DEV_API_SERVER_PORT);
        } else {
          host = process.env.PROD_API_SERVER_HOST ?? '';
          port = Number(process.env.PROD_API_SERVER_PORT);
        }
        return `http://${host}:${port}/`;
      },
    },
    modules: {
      invoices_quotations,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING,
  });

  // Vuex as a dependency injection container
  const dependencies: Record<string, unknown> = {};
  vuexStore.provide = function <T>(name: string, service: T) {
    dependencies[name] = service;
  };
  vuexStore.inject = function <T>(name: string) {
    if (name in dependencies) {
      const service = dependencies[name];
      return service as T;
    }
  };

  return vuexStore;
});

export function useStore() {
  return vuexUseStore(storeKey);
}

export { vuexStore };
