import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { CountriesStatesStateInterface } from './state';

export type CountriesStatesGetterInterface = GetterTree<
  CountriesStatesStateInterface,
  StateInterface
>;

const getters: CountriesStatesGetterInterface = {
  GET_COUNTRIES_FOR_SELECT: (state: CountriesStatesStateInterface) =>
    state.countriesForSelect,

  GET_COUNTRY_STATES_FOR_SELECT: (state: CountriesStatesStateInterface) =>
    state.countryStatesForSelect,
};

export default getters;
