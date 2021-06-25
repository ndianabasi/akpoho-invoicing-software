import { SelectOption } from '../types';

export interface ProductStateInterface {
  productTypesForSelect: SelectOption[];
  currentlyEditedProductType: SelectOption | null;
}

function state(): ProductStateInterface {
  return {
    productTypesForSelect: [],
    currentlyEditedProductType: null,
  };
}

export default state;
