import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  loginUser({ commit }) {
    // Async call
    const token = '';
    commit('SET_TOKEN', token);
  },
};

export default actions;
