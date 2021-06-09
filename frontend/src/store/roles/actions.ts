/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { RolesStateInterface /* Users */ } from './state';
import { api as $http } from '../../boot/http';
import { HttpResponse } from '../types';

const actions: ActionTree<RolesStateInterface, StateInterface> = {
  async FETCH_ROLES_FOR_SELECT({ commit }) {
    return new Promise(async (resolve) => {
      await $http.get('/roles/roles-for-select').then((res: HttpResponse) => {
        commit('SET_ROLES_FOR_SELECT', res.data.data);

        resolve(res.data);
      });
    });
  },

  async FETCH_GLOBAL_ROLES({ commit }) {
    return new Promise(async (resolve) => {
      await $http.get('/roles/global-roles').then((res: HttpResponse) => {
        commit('SET_GLOBAL_ROLES', res.data.data);

        resolve(res.data);
      });
    });
  },
};

export default actions;
