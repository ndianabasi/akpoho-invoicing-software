/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ProductStateInterface /* Users */ } from './state';
import { api as $http } from '../../boot/http';
import { HttpResponse } from '../types';

const actions: ActionTree<ProductStateInterface, StateInterface> = {
  async FETCH_PRODUCT_TYPES_FOR_SELECT({ commit }) {
    return new Promise(async (resolve) => {
      await $http
        .get('/product-types/product-types-for-select')
        .then((res: HttpResponse) => {
          commit('SET_PRODUCT_TYPES_FOR_SELECT', res.data.data);

          resolve(res.data);
        });
    });
  },
};

export default actions;
