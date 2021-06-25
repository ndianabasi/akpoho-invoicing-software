import { SelectOption } from '../types';

export interface AttributeStateInterface {
  attributeSetsForSelect: SelectOption[];
}

function state(): AttributeStateInterface {
  return {
    attributeSetsForSelect: [],
  };
}

export default state;
