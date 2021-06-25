import { MutationTree } from 'vuex';
import { ProductStateInterface } from './state';
import { SelectOption } from '../types';

const mutation: MutationTree<ProductStateInterface> = {
  SET_PRODUCT_TYPES_FOR_SELECT(
    state: ProductStateInterface,
    payload: SelectOption[]
  ) {
    state.productTypesForSelect = payload;
  },
};

export default mutation;
