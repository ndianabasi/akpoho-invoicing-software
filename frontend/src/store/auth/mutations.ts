import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';

const mutation: MutationTree<AuthStateInterface> = {
  SET_TOKEN(state: AuthStateInterface, payload) {
    state.token = payload as string;
  },
  LOGOUT_USER: (state: AuthStateInterface, message: string) => {
    state.token = '';
    state.authFormMessage = { message, type: 'danger' };
    localStorage.removeItem('akpoho-state');
  },
};

export default mutation;
