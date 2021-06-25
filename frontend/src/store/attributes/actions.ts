/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AttributeStateInterface /* Users */ } from './state';
import { api as $http } from '../../boot/http';
import { HttpResponse } from '../types';

const actions: ActionTree<AttributeStateInterface, StateInterface> = {
  async FETCH_ATTRIBUTE_SETS_FOR_SELECT({ commit }) {
    return new Promise(async (resolve) => {
      await $http
        .get('/attribute-sets/attribute-sets-for-select')
        .then((res: HttpResponse) => {
          commit('SET_ATTRIBUTE_SETS_FOR_SELECT', res.data.data);

          resolve(res.data);
        });
    });
  },

  async FETCH_ATTRIBUTE_SET_DATA(
    { commit },
    { id, type }: { id: string; type: 'product' | 'category' }
  ) {
    return new Promise(async (resolve) => {
      await $http
        .get(`/attribute-sets/${type}/${id}`)
        .then((res: HttpResponse) => {
          commit('SET_ATTRIBUTE_SET_DATA', res.data.data);

          resolve(res.data);
        });
    });
  },
};

export default actions;
