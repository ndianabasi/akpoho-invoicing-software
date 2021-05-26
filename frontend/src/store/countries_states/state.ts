import { SelectOption } from '../types';

export interface CountriesStatesStateInterface {
  countriesForSelect: SelectOption[];
}

function state(): CountriesStatesStateInterface {
  return {
    countriesForSelect: [],
  };
}

export default state;
