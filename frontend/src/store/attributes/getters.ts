import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AttributeStateInterface } from './state';

export type AttributeGetterInterface = GetterTree<
  AttributeStateInterface,
  StateInterface
>;

const getters: AttributeGetterInterface = {
  GET_ATTRIBUTE_SETS_FOR_SELECT: (state: AttributeStateInterface) =>
    state.attributeSetsForSelect,
};

export default getters;
