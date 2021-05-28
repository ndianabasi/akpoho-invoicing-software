import { SelectOption } from '../types';

export interface RolesStateInterface {
  rolesForSelect: SelectOption[];
}

function state(): RolesStateInterface {
  return {
    rolesForSelect: [],
  };
}

export default state;
