import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { BannerStateInterface } from './state';

const actions: ActionTree<BannerStateInterface, StateInterface> = {
  someAction(/* context */) {
    // your code
  },
};

export default actions;
