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
};

export default getters;
