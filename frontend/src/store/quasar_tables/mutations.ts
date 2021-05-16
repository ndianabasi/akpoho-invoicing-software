import { MutationTree } from 'vuex';
import { QuasarTableStateInterface, DataRows } from './state';

const mutation: MutationTree<QuasarTableStateInterface> = {
  SET_TABLE_DATA(state: QuasarTableStateInterface, payload: DataRows) {
    state.rows = payload;
  },
};

export default mutation;
