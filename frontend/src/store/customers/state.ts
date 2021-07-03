import {
  CurrentlyViewedAddress,
  CurrentlyViewedCustomer,
  SelectOption,
} from '../types';

export interface CustomersStateInterface {
  customerTitlesForSelect: SelectOption[];
  customerAddressesForSelect: SelectOption[];
  currentlyViewedCustomer: CurrentlyViewedCustomer | null;
  currentlyViewedAddress: CurrentlyViewedAddress | null;
}

function state(): CustomersStateInterface {
  return {
    customerTitlesForSelect: [],
    currentlyViewedCustomer: null,
    currentlyViewedAddress: null,
    customerAddressesForSelect: [],
  };
}

export default state;
