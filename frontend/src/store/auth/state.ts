export type LoginData = {
  username: string;
  password: string;
  remember_me: boolean;
};
export interface AuthStateInterface {
  token: string;
  authFormMessage: {
    message?: string;
    type?: string;
  };
  loginData: LoginData;
}

function state(): AuthStateInterface {
  return {
    token: '',
    authFormMessage: { message: '', type: '' },
    loginData: {
      username: '',
      password: '',
      remember_me: false,
    },
  };
}

export default state;
