import { MutationTree } from 'vuex';
import { SelectOption } from '../types';
import { CustomersStateInterface } from './state';

const mutation: MutationTree<CustomersStateInterface> = {
  SET_CUSTOMER_TITLES_FOR_SELECT(
    state: CustomersStateInterface,
    payload: SelectOption[]
  ) {
    state.customerTitlesForSelect = payload;
  },
};

export default mutation;
