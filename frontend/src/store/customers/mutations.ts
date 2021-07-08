import { MutationTree } from 'vuex';
import {
  CurrentlyViewedAddress,
  CurrentlyViewedCustomer,
  SelectOption,
} from '../types';
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

  SET_CURRENTLY_VIEWED_ADDRESS(
    state: CustomersStateInterface,
    payload: CurrentlyViewedAddress
  ) {
    state.currentlyViewedAddress = payload;
  },

  SET_CUSTOMER_ADDRESSES_FOR_SELECT(
    state: CustomersStateInterface,
    payload: SelectOption[]
  ) {
    state.customerAddressesForSelect = payload;
  },
};

export default mutation;
