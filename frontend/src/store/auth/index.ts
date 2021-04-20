import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { AuthStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const authModule: Module<AuthStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default authModule;
