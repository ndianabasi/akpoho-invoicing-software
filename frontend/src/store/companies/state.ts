import { CurrentlyViewedCompany, SelectOption } from '../types';

export interface CompanyStateInterface {
  currentlyViewedCompany: CurrentlyViewedCompany | null;
  companySizesForSelect: SelectOption[] | null;
}

function state(): CompanyStateInterface {
  return {
    currentlyViewedCompany: null,
    companySizesForSelect: null,
  };
}

export default state;
