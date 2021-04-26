import { MutationTree } from 'vuex';
import { AuthStateInterface, LoginData } from './state';

const mutation: MutationTree<AuthStateInterface> = {
  SET_TOKEN(state: AuthStateInterface, payload) {
    state.token = payload as string;
  },
  SET_LOGIN_DATA(state: AuthStateInterface, payload: LoginData) {
    state.loginData = payload;
  },
  LOGOUT_USER: (state: AuthStateInterface) => {
    state.token = '';
  },
};

export default mutation;
