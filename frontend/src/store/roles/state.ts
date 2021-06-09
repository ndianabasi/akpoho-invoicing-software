import { SelectOption } from '../types';

export interface RolesStateInterface {
  rolesForSelect: SelectOption[];
  globalRoles: string[];
}

function state(): RolesStateInterface {
  return {
    rolesForSelect: [],
    globalRoles: [],
  };
}

export default state;
