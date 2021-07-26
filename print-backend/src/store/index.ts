import { store } from 'quasar/wrappers';
import { InjectionKey } from 'vue';
import {
  createStore,
  GetterTree,
  MutationTree,
  Store as VuexStore,
  useStore as vuexUseStore,
} from 'vuex';

import invoices_quotations from './invoices_quotations';
import { InvoiceQuotationStateInterface } from './invoices_quotations/state';

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

export default store(function (/* { ssrContext } */) {
  const Store = createStore<StoreState>({
    /* state: function () {
      return {};
    }, */
    getters: {},
    modules: {
      invoices_quotations,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING,
  });

  return Store;
});

export function useStore() {
  return vuexUseStore(storeKey);
}
