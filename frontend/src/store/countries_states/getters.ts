import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { CountriesStatesStateInterface } from './state';

export type UsersGetterInterface = GetterTree<
  CountriesStatesStateInterface,
  StateInterface
>;

const getters: UsersGetterInterface = {
  GET_COUNTRIES_STATES_FOR_SELECT: (state: CountriesStatesStateInterface) =>
    state.countriesForSelect,
};

export default getters;
