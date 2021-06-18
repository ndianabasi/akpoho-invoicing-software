import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { CompanyStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const CompaniesModule: Module<CompanyStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default CompaniesModule;
