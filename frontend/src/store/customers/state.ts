import { SelectOption } from '../types';

export interface CustomersStateInterface {
  customerTitlesForSelect: SelectOption[];
}

function state(): CustomersStateInterface {
  return {
    customerTitlesForSelect: [],
  };
}

export default state;
