import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { RolesStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const UsersModule: Module<RolesStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default UsersModule;
