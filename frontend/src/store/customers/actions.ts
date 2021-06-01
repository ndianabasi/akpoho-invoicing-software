/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { CustomersStateInterface /* Customers */ } from './state';
import { api as $http } from '../../boot/http';
import { HttpResponse, HttpError, StringIDNameInterface } from '../types';
import { PaginationParams } from '../../types/table';
import { Notify } from 'quasar';

const actions: ActionTree<CustomersStateInterface, StateInterface> = {
  async FETCH_ALL_CUSTOMERS(
    { commit, rootGetters },
    requestParams: PaginationParams
  ) {
    return new Promise(async (resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const currentCompany = rootGetters[
        'auth/GET_CURRENT_COMPANY'
      ] as StringIDNameInterface;

      await $http
        .get(`/${currentCompany.id}/customers`, {
          params: requestParams ? requestParams : {},
        })
        .then((res: HttpResponse) => {
          commit('SET_ALL_CUSTOMERS', res.data.data);

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

  async DELETE_CUSTOMER({ rootGetters }, ID: string) {
    return new Promise(async (resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const currentCompany = rootGetters[
        'auth/GET_CURRENT_COMPANY'
      ] as StringIDNameInterface;

      await $http
        .delete(`/${currentCompany.id}/customers/${ID}`)
        .then((res: HttpResponse) => {
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

  async FETCH_CUSTOMER_TITLES_FOR_SELECT({ commit }) {
    return new Promise(async (resolve) => {
      await $http
        .get('/customer-titles/customer-titles-for-select')
        .then((res: HttpResponse) => {
          commit('SET_CUSTOMER_TITLES_FOR_SELECT', res.data.data);

          resolve(res.data);
        });
    });
  },
};

export default actions;
