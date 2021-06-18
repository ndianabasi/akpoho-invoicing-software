import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { BannerStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const BannersModule: Module<BannerStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default BannersModule;
