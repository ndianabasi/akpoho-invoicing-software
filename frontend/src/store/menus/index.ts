import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { MenusStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const MenusModule: Module<MenusStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default MenusModule;
