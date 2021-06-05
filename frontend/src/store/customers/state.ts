import {
  CurrentlyViewedAddress,
  CurrentlyViewedCustomer,
  SelectOption,
} from '../types';

export interface CustomersStateInterface {
  customerTitlesForSelect: SelectOption[];
  currentlyViewedCustomer: CurrentlyViewedCustomer | null;
  currentlyViewedAddress: CurrentlyViewedAddress | null;
}

function state(): CustomersStateInterface {
  return {
    customerTitlesForSelect: [],
    currentlyViewedCustomer: null,
    currentlyViewedAddress: null,
  };
}

export default state;
