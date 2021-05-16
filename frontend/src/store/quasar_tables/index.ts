import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { QuasarTableStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const QuasarTablesModule: Module<QuasarTableStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default QuasarTablesModule;
