import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { CountriesStatesStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const UsersModule: Module<CountriesStatesStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default UsersModule;
