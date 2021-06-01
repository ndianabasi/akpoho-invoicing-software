export interface PermissionStateInterface {
  userPermissions: string[];
}

function state(): PermissionStateInterface {
  return {
    userPermissions: [],
  };
}

export default state;
