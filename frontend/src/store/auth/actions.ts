import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';
//import {AuthGettersInterface} from './getters'
import { api as $httpNoAuth } from '../../boot/httpNoAuth';

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  loginUser({ commit }) {
    // Async call
    const token = '';
    commit('SET_TOKEN', token);
  },
  logoutUser({ commit }, { message }) {
    commit('LOGOUT_USER', message);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete $httpNoAuth.defaults.headers.common['Authorization'];
  },
};

export default actions;
