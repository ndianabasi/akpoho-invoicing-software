import { MutationTree } from 'vuex';
import { CountriesStatesStateInterface } from './state';
import { SelectOption } from '../types';

const mutation: MutationTree<CountriesStatesStateInterface> = {
  SET_COUNTRIES_FOR_SELECT(
    state: CountriesStatesStateInterface,
    payload: SelectOption[]
  ) {
    state.countriesForSelect = payload;
  },

  SET_COUNTRY_STATES_FOR_SELECT(
    state: CountriesStatesStateInterface,
    payload: SelectOption[]
  ) {
    state.countryStatesForSelect = payload;
  },
};

export default mutation;
