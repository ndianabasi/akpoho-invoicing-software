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
  GET_AUTH_ROLE: (state) => state.authRole?.name,
};

export default getters;
