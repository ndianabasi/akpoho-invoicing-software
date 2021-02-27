export interface AuthStateInterface {
  token: string;
}

function state(): AuthStateInterface {
  return {
    token: '',
  };
}

export default state;
