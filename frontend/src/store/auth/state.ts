export interface AuthStateInterface {
  token: string;
  authFormMessage: {
    message?: string;
    type?: string;
  };
}

function state(): AuthStateInterface {
  return {
    token: '',
    authFormMessage: { message: '', type: '' },
  };
}

export default state;
