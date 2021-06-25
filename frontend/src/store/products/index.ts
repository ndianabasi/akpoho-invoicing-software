import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { ProductStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const ProductsModule: Module<ProductStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default ProductsModule;
