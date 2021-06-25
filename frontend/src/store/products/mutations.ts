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

  SET_CURRENTLY_EDITED_PRODUCT_TYPE(
    state: ProductStateInterface,
    payload: SelectOption
  ) {
    state.currentlyEditedProductType = payload;
  },
};

export default mutation;
