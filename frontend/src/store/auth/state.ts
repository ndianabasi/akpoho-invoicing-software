import { UserCompany, UserProfileSummary, UserSummary } from '../types';

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
  userSummary: UserSummary | null;
  userCompanies: UserCompany[] | null;
  userProfile: UserProfileSummary | null;
  currentCompany: { name: string; id: string } | null;
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
    userCompanies: null,
    userProfile: null,
    userSummary: null,
    currentCompany: null,
  };
}

export default state;
