/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { CustomersStateInterface /* Customers */ } from './state';
import { api as $http } from '../../boot/http';
import {
  HttpResponse,
  HttpError,
  StringIDNameInterface,
  CustomerFormShape,
} from '../types';
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

  async FETCH_CURRENTLY_VIEWED_CUSTOMER(
    { commit, rootGetters },
    { customerId }: { customerId: string }
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const currentCompany = rootGetters[
      'auth/GET_CURRENT_COMPANY'
    ] as StringIDNameInterface;
    return new Promise(async (resolve) => {
      await $http
        .get(`/${currentCompany.id}/customers/${customerId}`)
        .then((res: HttpResponse) => {
          commit('SET_CURRENTLY_VIEWED_CUSTOMER', res.data.data);

          resolve(res.data);
        });
    });
  },

  async CREATE_CUSTOMER(
    { rootGetters },
    { form }: { form: CustomerFormShape }
  ) {
    return new Promise(async (resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const currentCompany = rootGetters[
        'auth/GET_CURRENT_COMPANY'
      ] as StringIDNameInterface;

      await $http
        .post(`/${currentCompany.id}/customers`, { ...form })
        .then((res: HttpResponse) => {
          Notify.create({
            message: 'Customer was successfully created',
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

  async EDIT_CUSTOMER(
    { rootGetters },
    { customerId, form }: { customerId: string; form: CustomerFormShape }
  ) {
    return new Promise(async (resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const currentCompany = rootGetters[
        'auth/GET_CURRENT_COMPANY'
      ] as StringIDNameInterface;

      await $http
        .patch(`/${currentCompany.id}/customers/${customerId}`, { ...form })
        .then((res: HttpResponse) => {
          Notify.create({
            message: 'Customer was successfully edited',
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

  async FETCH_CURRENTLY_VIEWED_ADDRESS(
    { commit, rootGetters },
    {
      customerId,
      customerAddressId,
    }: { customerId: string; customerAddressId: string }
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const currentCompany = rootGetters[
      'auth/GET_CURRENT_COMPANY'
    ] as StringIDNameInterface;
    return new Promise(async (resolve) => {
      await $http
        .get(
          `/${currentCompany.id}/customers/${customerId}/customer-addresses/${customerAddressId}`
        )
        .then((res: HttpResponse) => {
          commit('SET_CURRENTLY_VIEWED_ADDRESS', res.data.data);

          resolve(res.data);
        });
    });
  },
};

export default actions;
