export interface User {
  id: string;
}
export interface UsersStateInterface {
  currentlyViewedUser: unknown;
}

export type Users = Array<User>;

function state(): UsersStateInterface {
  return {
    currentlyViewedUser: null,
  };
}

export default state;
