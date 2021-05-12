import { MutationTree } from 'vuex';
import { CustomersStateInterface } from './state';
import { Customer } from './state';

const mutation: MutationTree<CustomersStateInterface> = {
  SET_ALL_CUSTOMERS(state: CustomersStateInterface, payload: Array<Customer>) {
    state.customers = payload;
  },
};

export default mutation;
