import { MutationTree } from 'vuex';
import { UsersStateInterface } from './state';

const mutation: MutationTree<UsersStateInterface> = {
  SET_CURRENTLY_VIEWED_USER(state: UsersStateInterface, payload: unknown) {
    state.currentlyViewedUser = payload;
  },
};

export default mutation;
