import { ProductResultRowInterface, SelectOption } from '../types';

export interface ProductStateInterface {
  productTypesForSelect: SelectOption[];
  currentlyEditedProductType: SelectOption | null;
  currentlyViewedProduct: ProductResultRowInterface | null;
}

function state(): ProductStateInterface {
  return {
    productTypesForSelect: [],
    currentlyEditedProductType: null,
    currentlyViewedProduct: null,
  };
}

export default state;
