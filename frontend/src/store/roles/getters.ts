import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { RolesStateInterface } from './state';

export type RolesGetterInterface = GetterTree<
  RolesStateInterface,
  StateInterface
>;

const getters: RolesGetterInterface = {
  GET_ROLES_FOR_SELECT: (state: RolesStateInterface) => state.rolesForSelect,
};

export default getters;
