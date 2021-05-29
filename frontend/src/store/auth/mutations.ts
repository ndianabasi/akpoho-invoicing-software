import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';
import { LoginUserData, LoginData, StringSelectOption } from '../types';

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

  SET_CURRENT_COMPANY: (
    state: AuthStateInterface,
    payload: StringSelectOption
  ) => {
    state.currentCompany = { id: payload.value, name: payload.label };
  },

  SET_USER_DATA(state: AuthStateInterface, payload: LoginUserData) {
    state.userCompanies = payload.companies;
    state.userProfile = {
      first_name: payload.profile.first_name,
      last_name: payload.profile.last_name,
      id: payload.profile.id,
      profile_picture: payload.profile.profile_picture,
    };

    state.userSummary = {
      id: payload.id,
      email: payload.email,
      is_account_activated: Boolean(payload.is_account_activated),
      is_email_verified: Boolean(payload.is_email_verified),
      login_status: Boolean(payload.login_status),
    };

    state.authRole = payload.role;
  },
};

export default mutation;
