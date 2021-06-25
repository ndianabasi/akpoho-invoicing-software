import { MutationTree } from 'vuex';
import { AttributeStateInterface } from './state';
import { SelectOption } from '../types';

const mutation: MutationTree<AttributeStateInterface> = {
  SET_ATTRIBUTE_SETS_FOR_SELECT(
    state: AttributeStateInterface,
    payload: SelectOption[]
  ) {
    state.attributeSetsForSelect = payload;
  },
};

export default mutation;
