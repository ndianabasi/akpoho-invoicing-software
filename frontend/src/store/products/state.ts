import { SelectOption } from '../types';

export interface ProductStateInterface {
  productTypesForSelect: SelectOption[];
}

function state(): ProductStateInterface {
  return {
    productTypesForSelect: [],
  };
}

export default state;
