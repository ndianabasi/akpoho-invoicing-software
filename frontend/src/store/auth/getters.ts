/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';

export interface AuthGettersInterface {
  getToken: (state: AuthStateInterface) => string;
  isLoggedIn: (state: AuthStateInterface) => boolean;
}

const getters: GetterTree<AuthStateInterface, StateInterface> = {
  getToken(state: AuthStateInterface) {
    return state.token;
  },

  isLoggedIn: (state) => {
    return !!state.token;
  },
  GET_USER_COMPANIES: (state) => state.userCompanies,
  GET_CURRENT_COMPANY: (state) => state.currentCompany,
  GET_USER_PROFILE: (state) => state.userProfile,
  GET_USER_SUMMARY: (state) => state.userSummary,
  GET_USER_ID: (state) => state.userSummary?.id,
  GET_AUTH_ROLE: (state) => state.authRole?.name,
  IS_GLOBAL_USER: (state, getters, rootState, rootGetters) => {
    const globalRoles: string[] = rootGetters['roles/GET_GLOBAL_ROLES'];
    const authRole: string = getters.GET_AUTH_ROLE;
    return authRole && globalRoles && !!globalRoles.length
      ? globalRoles.some((role: string) => role === authRole)
      : false;
  },
};

export default getters;
