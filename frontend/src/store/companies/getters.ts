import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { CompanyStateInterface } from './state';

export type CompanyGetterInterface = GetterTree<
  CompanyStateInterface,
  StateInterface
>;

const getters: CompanyGetterInterface = {
  GET_CURRENTLY_VIEWED_COMPANY: (state: CompanyStateInterface) =>
    state.currentlyViewedCompany,

  GET_COMPANY_SIZES_FOR_SELECT: (state: CompanyStateInterface) =>
    state.companySizesForSelect,
};

export default getters;
