/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { UsersStateInterface /* Users */ } from './state';
import { api as $http } from '../../boot/http';
import {
  HttpResponse,
  HttpError,
  StringIDNameInterface,
  UserFormShape,
} from '../types';
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

          return resolve(res.data);
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

          return reject(error);
        });
    });
  },

  async CREATE_USER({ rootGetters }, { form }: { form: UserFormShape }) {
    return new Promise(async (resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const currentCompany = rootGetters[
        'auth/GET_CURRENT_COMPANY'
      ] as StringIDNameInterface;

      await $http
        .post(`/${currentCompany.id}/users`, { ...form })
        .then((res: HttpResponse) => {
          Notify.create({
            message: 'User was successfully created',
            type: 'positive',
            position: 'top',
            progress: true,
            timeout: 5000,
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          });

          return resolve(res.data.data);
        })
        .catch((error: HttpError) => {
          return reject(error);
        });
    });
  },

  async EDIT_USER(
    { rootGetters },
    { userId, form }: { userId: string; form: UserFormShape }
  ) {
    return new Promise(async (resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const currentCompany = rootGetters[
        'auth/GET_CURRENT_COMPANY'
      ] as StringIDNameInterface;

      await $http
        .patch(`/${currentCompany.id}/users/${userId}`, { ...form })
        .then((res: HttpResponse) => {
          Notify.create({
            message: 'User was successfully edited',
            type: 'positive',
            position: 'top',
            progress: true,
            timeout: 5000,
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          });

          return resolve(res.data);
        })
        .catch((error: HttpError) => {
          return reject(error);
        });
    });
  },

  async DELETE_USER({ rootGetters }, userId: string) {
    return new Promise(async (resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const currentCompany = rootGetters[
        'auth/GET_CURRENT_COMPANY'
      ] as StringIDNameInterface;

      await $http
        .delete(`/${currentCompany.id}/users/${userId}`)
        .then((res: HttpResponse) => {
          Notify.create({
            message: 'User was successfully deleted',
            type: 'positive',
            position: 'top',
            progress: true,
            timeout: 5000,
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          });

          return resolve(res.data.data);
        })
        .catch((error: HttpError) => {
          return reject(error);
        });
    });
  },
};

export default actions;
