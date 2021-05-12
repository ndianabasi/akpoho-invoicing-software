/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { CustomersStateInterface, Customers } from './state';
import { api as $http } from '../../boot/http';
import { HttpResponse, HttpError } from '../types';
import { Notify } from 'quasar';

const actions: ActionTree<CustomersStateInterface, StateInterface> = {
  async FETCH_ALL_CUSTOMERS({ commit }) {
    return new Promise(async (resolve, reject) => {
      await $http
        .get('/abcd-eee-fff-ggg/customers')
        .then((res: HttpResponse) => {
          console.log(res.data);
          commit('SET_ALL_CUSTOMERS', res.data.data as Customers);

          Notify.create({
            message: res.data?.message,
            type: 'positive',
            position: 'top',
            progress: true,
            timeout: 2000,
            actions: [
              {
                label: 'Dismiss',
                color: 'white',
              },
            ],
          });

          resolve(res.data);
        })
        .catch((error: HttpError) => {
          Notify.create({
            message:
              (error?.response?.data as string) ?? 'An unknown error occurred!',
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
};

export default actions;
