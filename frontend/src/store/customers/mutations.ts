import { MutationTree } from 'vuex';
import { CurrentlyViewedCustomer, SelectOption } from '../types';
import { CustomersStateInterface } from './state';

const mutation: MutationTree<CustomersStateInterface> = {
  SET_CUSTOMER_TITLES_FOR_SELECT(
    state: CustomersStateInterface,
    payload: SelectOption[]
  ) {
    state.customerTitlesForSelect = payload;
  },

  SET_CURRENTLY_VIEWED_CUSTOMER(
    state: CustomersStateInterface,
    payload: CurrentlyViewedCustomer
  ) {
    state.currentlyViewedCustomer = payload;
  },
};

export default mutation;
