/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AttributeStateInterface /* Users */ } from './state';
import { api as $http } from '../../boot/http';
import { HttpError, HttpResponse, StringIDNameInterface } from '../types';

const actions: ActionTree<AttributeStateInterface, StateInterface> = {
  async FETCH_ATTRIBUTE_SETS_FOR_SELECT({ commit }) {
    return new Promise(async (resolve, reject) => {
      await $http
        .get('/attribute-sets/attribute-sets-for-select')
        .then((res: HttpResponse) => {
          commit('SET_ATTRIBUTE_SETS_FOR_SELECT', res.data.data);

          return resolve(res.data);
        })
        .catch((error: HttpError) => {
          return reject(error);
        });
    });
  },

  async FETCH_ATTRIBUTE_SET_DATA(
    { commit, rootGetters },
    { id, type }: { id: string; type: 'product' | 'category' }
  ) {
    return new Promise(async (resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const currentCompany = rootGetters[
        'auth/GET_CURRENT_COMPANY'
      ] as StringIDNameInterface;

      await $http
        .get(`${currentCompany.id}/attribute-sets/${type}/${id}`)
        .then((res: HttpResponse) => {
          commit('SET_ATTRIBUTE_SET_DATA', res.data.data);

          return resolve(res.data);
        })
        .catch((error: HttpError) => {
          return reject(error);
        });
    });
  },
};

export default actions;
