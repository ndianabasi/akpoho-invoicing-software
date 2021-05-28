import { SelectOption } from '../types';

export interface CountriesStatesStateInterface {
  countriesForSelect: SelectOption[];
  countryStatesForSelect: SelectOption[];
}

function state(): CountriesStatesStateInterface {
  return {
    countriesForSelect: [],
    countryStatesForSelect: [],
  };
}

export default state;
