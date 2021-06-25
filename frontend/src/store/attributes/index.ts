import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { AttributeStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const AttributesModule: Module<AttributeStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default AttributesModule;
