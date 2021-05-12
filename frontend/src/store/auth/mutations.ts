import { MutationTree } from 'vuex';
import { AuthStateInterface, LoginData } from './state';

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
};

export default mutation;
