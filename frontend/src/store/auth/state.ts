import {
  LoginData,
  UserSummary,
  StringIDNameInterface,
  FileMultiFormats,
  RoleInterface,
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
  userProfile: UserProfile | null;
  currentCompany: StringIDNameInterface | null;
  authRole: RoleInterface | null;
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture: FileMultiFormats;
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
