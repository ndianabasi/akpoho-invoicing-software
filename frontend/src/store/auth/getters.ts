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
};

export default getters;
