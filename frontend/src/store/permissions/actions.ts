/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { PermissionStateInterface } from './state';
import { api as $http } from '../../boot/http';
import { HttpError, HttpResponse } from '../types';

const actions: ActionTree<PermissionStateInterface, StateInterface> = {
  FETCH_USER_PERMISSIONS({ commit }) {
    return new Promise(async (resolve, reject) => {
      await $http
        .get('permissions/user-permissions')
        .then((res: HttpResponse) => {
          commit('SET_USER_PERMISSIONS', res.data.data);
          return resolve(res.data);
        })
        .catch((error: HttpError) => {
          return reject(error);
        });
    });
  },
};

export default actions;
