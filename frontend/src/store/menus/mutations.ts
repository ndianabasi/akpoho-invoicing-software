import { MutationTree } from 'vuex';
import { MenusStateInterface } from './state';
//import { MutationPayload } from '../../types/store';

const mutation: MutationTree<MenusStateInterface> = {
  TOGGLE_LEFT_DRAWER(state: MenusStateInterface) {
    state.leftDrawerOpen = !state.leftDrawerOpen;
    console.log(state.leftDrawerOpen);
  },
};

export default mutation;
