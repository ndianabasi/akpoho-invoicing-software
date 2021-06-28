/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ProductStateInterface /* Users */ } from './state';
import { api as $http } from '../../boot/http';
import { HttpError, HttpResponse } from '../types';
import { Notify } from 'quasar';

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

  async CREATE_PRODUCT(
    ctx,
    {
      form,
      attributeSetId,
    }: { form: { [index: string]: unknown }; attributeSetId: string }
  ) {
    console.log(form);

    return new Promise(async (resolve, reject) => {
      await $http
        .post('/products', { ...form, attributeSetId })
        .then((res: HttpResponse) => {
          Notify.create({
            message: 'Product was successfully created',
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
