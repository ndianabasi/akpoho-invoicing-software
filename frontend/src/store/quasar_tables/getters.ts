import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { QuasarTableStateInterface } from './state';

export type QuasarTableGetterInterface = GetterTree<
  QuasarTableStateInterface,
  StateInterface
>;

const getters: QuasarTableGetterInterface = {
  GET_TABLE_ROWS: (state: QuasarTableStateInterface) => state.rows,
};

export default getters;
