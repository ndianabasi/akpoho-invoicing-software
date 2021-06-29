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
  GET_CURRENTLY_EDITED_PRODUCT_TYPE: (state: ProductStateInterface) =>
    state.currentlyEditedProductType,
  GET_CURRENTLY_VIEWED_PRODUCT: (state: ProductStateInterface) =>
    state.currentlyViewedProduct,
};

export default getters;
