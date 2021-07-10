import {
  CurrentlyViewedAddress,
  CurrentlyViewedCustomer,
  CustomerAddressForSelectPayload,
  SelectOption,
} from '../types';

export interface CustomersStateInterface {
  customerTitlesForSelect: SelectOption[];
  customerAddressesForSelect: CustomerAddressForSelectPayload | null;
  currentlyViewedCustomer: CurrentlyViewedCustomer | null;
  currentlyViewedAddress: CurrentlyViewedAddress | null;
}

function state(): CustomersStateInterface {
  return {
    customerTitlesForSelect: [],
    currentlyViewedCustomer: null,
    currentlyViewedAddress: null,
    customerAddressesForSelect: null,
  };
}

export default state;
