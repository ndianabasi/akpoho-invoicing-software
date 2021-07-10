import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { InvoiceQuotationStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const InvoiceQuotationModule: Module<
  InvoiceQuotationStateInterface,
  StateInterface
> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default InvoiceQuotationModule;
