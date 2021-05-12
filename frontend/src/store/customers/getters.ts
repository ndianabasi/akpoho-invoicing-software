import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { CustomersStateInterface } from './state';

export type CustomersGetterInterface = GetterTree<
  CustomersStateInterface,
  StateInterface
>;

const getters: CustomersGetterInterface = {
  GET_ALL_CUSTOMERS: (state: CustomersStateInterface) => state.customers,
};

export default getters;
