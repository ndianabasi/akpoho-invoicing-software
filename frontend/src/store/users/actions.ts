/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { UsersStateInterface /* Users */ } from './state';
import { api as $http } from '../../boot/http';
import { HttpResponse, HttpError, StringIDNameInterface } from '../types';
import { Notify } from 'quasar';

const actions: ActionTree<UsersStateInterface, StateInterface> = {
  async FETCH_CURRENTLY_VIEW_USER(
    { commit, rootGetters },
    { userId }: { userId: string }
  ) {
    return new Promise(async (resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const currentCompany = rootGetters[
        'auth/GET_CURRENT_COMPANY'
      ] as StringIDNameInterface;

      await $http
        .get(`/${currentCompany.id}/users/${userId}`)
        .then((res: HttpResponse) => {
          commit('SET_CURRENTLY_VIEWED_USER', res.data.data);

          resolve(res.data);
        })
        .catch((error: HttpError) => {
          Notify.create({
            message:
              error?.response?.data?.message ?? 'An unknown error occurred!',
            type: 'negative',
            position: 'top',
            progress: true,
            timeout: 10000,
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          });

          reject(error);
        });
    });
  },

  async DELETE_USER({ rootGetters }, { userId }: { userId: string }) {
    return new Promise(async (resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const currentCompany = rootGetters[
        'auth/GET_CURRENT_COMPANY'
      ] as StringIDNameInterface;

      await $http
        .delete(`/${currentCompany.id}/users/${userId}`)
        .then((res: HttpResponse) => {
          resolve(res.data);

          Notify.create({
            message: 'User was successfully deleted',
            type: 'positive',
            position: 'bottom',
            progress: true,
            timeout: 5000,
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          });
        })
        .catch((error: HttpError) => {
          reject(error);
        });
    });
  },
};

export default actions;
