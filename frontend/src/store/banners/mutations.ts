import { MutationTree } from 'vuex';
import { BannerStateInterface } from './state';
//import { MutationPayload } from '../../types/store';

const mutation: MutationTree<BannerStateInterface> = {
  ADD_BANNER(state: BannerStateInterface, payload) {
    console.log(payload);

    if (Array.isArray(payload)) state.banners.concat(payload);
    else state.banners.push(payload);
  },
};

export default mutation;
