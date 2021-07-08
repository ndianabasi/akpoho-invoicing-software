import { AttributeSetData, SelectOption } from '../types';

export interface AttributeStateInterface {
  attributeSetsForSelect: SelectOption[];
  attributeSetData: AttributeSetData | null;
}

function state(): AttributeStateInterface {
  return {
    attributeSetsForSelect: [],
    attributeSetData: null,
  };
}

export default state;
