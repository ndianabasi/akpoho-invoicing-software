import { MutationTree } from 'vuex';
import { CountriesStatesStateInterface } from './state';
import { SelectOption } from '../types';

const mutation: MutationTree<CountriesStatesStateInterface> = {
  SET_COUNTRIES_STATES_FOR_SELECT(
    state: CountriesStatesStateInterface,
    payload: SelectOption[]
  ) {
    state.countriesForSelect = payload;
  },
};

export default mutation;
