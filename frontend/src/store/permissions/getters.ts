import { stringSortFn } from 'src/helpers/utils';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { PermissionStateInterface } from './state';

export interface PermissionGettersInterface {
  GET_USER_PERMISSIONS: (
    state: PermissionStateInterface
  ) => typeof state.userPermissions;
  GET_USER_PERMISSION: (state: PermissionStateInterface) => boolean;
}

const getters: GetterTree<PermissionStateInterface, StateInterface> = {
  GET_USER_PERMISSIONS: (state) => {
    const userPermissions = [...state.userPermissions];
    return userPermissions.sort((a, b) => stringSortFn(a, b));
  },
  GET_USER_PERMISSION: (state) => (permission: string) => {
    return state.userPermissions && state.userPermissions.length
      ? state.userPermissions.includes(permission)
      : true;
  },
};

export default getters;
