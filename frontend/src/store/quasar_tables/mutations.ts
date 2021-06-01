import { MutationTree } from 'vuex';
import { QuasarTableStateInterface, DataRows } from './state';

const mutation: MutationTree<QuasarTableStateInterface> = {
  SET_TABLE_DATA(state: QuasarTableStateInterface, payload: DataRows) {
    state.rows = payload;
  },

  DELETE_TABLE_DATA_ROW(state: QuasarTableStateInterface, rowId: string) {
    state.rows = state.rows.filter((row) => row.id !== rowId);
  },
};

export default mutation;
