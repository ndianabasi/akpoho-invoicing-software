import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { CustomersStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const CustomersModule: Module<CustomersStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default CustomersModule;
