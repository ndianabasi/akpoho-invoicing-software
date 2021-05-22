import {
  LoginData,
  UserSummary,
  UserProfileSummary,
  StringIDNameInterface,
} from '../types';
export interface AuthStateInterface {
  token: string;
  authFormMessage: {
    message?: string;
    type?: string;
  };
  loginData: LoginData;
  userSummary: UserSummary | null;
  userCompanies: StringIDNameInterface[] | null;
  userProfile: UserProfileSummary | null;
  currentCompany: StringIDNameInterface | null;
  authRole: StringIDNameInterface | null;
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
    authRole: null,
  };
}

export default state;
