import { MutationTree } from 'vuex';
import { RolesStateInterface } from './state';
import { SelectOption } from '../types';

const mutation: MutationTree<RolesStateInterface> = {
  SET_ROLES_FOR_SELECT(state: RolesStateInterface, payload: SelectOption[]) {
    state.rolesForSelect = payload;
  },

  SET_GLOBAL_ROLES(state: RolesStateInterface, payload: string[]) {
    state.globalRoles = payload;
  },
};

export default mutation;
