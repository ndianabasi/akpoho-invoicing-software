import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ProductStateInterface } from './state';

export type ProductGetterInterface = GetterTree<
  ProductStateInterface,
  StateInterface
>;

const getters: ProductGetterInterface = {
  GET_PRODUCT_TYPES_FOR_SELECT: (state: ProductStateInterface) =>
    state.productTypesForSelect,
};

export default getters;
