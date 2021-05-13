import { MutationTree } from 'vuex';
import { AuthStateInterface, LoginData } from './state';
import { LoginUserData, SelectOption } from '../types';

type Token = {
  token: string;
  type: string;
};

const mutation: MutationTree<AuthStateInterface> = {
  SET_TOKEN(state: AuthStateInterface, payload: Token) {
    state.token = payload.token;
  },

  SET_LOGIN_DATA(state: AuthStateInterface, payload: LoginData) {
    state.loginData = payload;
  },

  LOGOUT_USER: (state: AuthStateInterface) => {
    state.token = '';
  },

  SET_CURRENT_COMPANY: (state: AuthStateInterface, payload: SelectOption) => {
    state.currentCompany = { id: payload.value, name: payload.label };
  },

  SET_USER_DATA(state: AuthStateInterface, payload: LoginUserData) {
    state.userCompanies = payload.companies;
    state.userProfile = {
      first_name: payload.profile.first_name,
      last_name: payload.profile.last_name,
      id: payload.profile.id,
    };
    state.userSummary = {
      id: payload.id,
      email: payload.email,
      is_account_activated: Boolean(payload.is_account_activated),
      is_email_verified: Boolean(payload.is_email_verified),
      login_status: Boolean(payload.login_status),
    };
  },
};

export default mutation;
