import { MutationTree } from 'vuex';
import { CurrentlyViewedCompany, SelectOption } from '../types';
import { CompanyStateInterface } from './state';

const mutation: MutationTree<CompanyStateInterface> = {
  SET_CURRENTLY_VIEWED_COMPANY(
    state: CompanyStateInterface,
    payload: CurrentlyViewedCompany
  ) {
    state.currentlyViewedCompany = payload;
  },

  SET_COMPANY_SIZES_FOR_SELECT(
    state: CompanyStateInterface,
    payload: SelectOption[]
  ) {
    state.companySizesForSelect = payload;
  },
};

export default mutation;
