import { MutationTree } from 'vuex';
import { AttributeStateInterface } from './state';
import { AttributeSetData, SelectOption } from '../types';

const mutation: MutationTree<AttributeStateInterface> = {
  SET_ATTRIBUTE_SETS_FOR_SELECT(
    state: AttributeStateInterface,
    payload: SelectOption[]
  ) {
    state.attributeSetsForSelect = payload;
  },

  SET_ATTRIBUTE_SET_DATA(
    state: AttributeStateInterface,
    payload: AttributeSetData
  ) {
    state.attributeSetData = payload;
  },
};

export default mutation;
