import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { MenusStateInterface } from './state';

const actions: ActionTree<MenusStateInterface, StateInterface> = {
  someAction(/* context */) {
    // your code
  },
};

export default actions;
