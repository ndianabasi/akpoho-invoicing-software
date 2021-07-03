import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { CustomersStateInterface } from './state';

export type CustomersGetterInterface = GetterTree<
  CustomersStateInterface,
  StateInterface
>;

const getters: CustomersGetterInterface = {
  GET_CUSTOMER_TITLES_FOR_SELECT: (state: CustomersStateInterface) =>
    state.customerTitlesForSelect,

  GET_CUSTOMER_ADDRESSES_FOR_SELECT: (state: CustomersStateInterface) =>
    state.customerAddressesForSelect,

  GET_CURRENTLY_VIEWED_CUSTOMER: (state: CustomersStateInterface) =>
    state.currentlyViewedCustomer,

  GET_CURRENTLY_VIEWED_ADDRESS: (state: CustomersStateInterface) =>
    state.currentlyViewedAddress,
};

export default getters;
