import { CurrentlyViewedCustomer, SelectOption } from '../types';

export interface CustomersStateInterface {
  customerTitlesForSelect: SelectOption[];
  currentlyViewedCustomer: CurrentlyViewedCustomer | null;
}

function state(): CustomersStateInterface {
  return {
    customerTitlesForSelect: [],
    currentlyViewedCustomer: null,
  };
}

export default state;
