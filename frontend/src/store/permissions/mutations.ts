import { MutationTree } from 'vuex';
import { PermissionStateInterface } from './state';

const mutation: MutationTree<PermissionStateInterface> = {
  SET_USER_PERMISSIONS(state: PermissionStateInterface, payload: string[]) {
    state.userPermissions = payload;
  },
};

export default mutation;
