/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ProductStateInterface /* Users */ } from './state';
import { api as $http } from '../../boot/http';
import { HttpError, HttpResponse, StringIDNameInterface } from '../types';
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
    { rootGetters },
    {
      form,
      attributeSetId,
    }: { form: { [index: string]: unknown }; attributeSetId: string }
  ) {
    console.log(form);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const currentCompany = rootGetters[
      'auth/GET_CURRENT_COMPANY'
    ] as StringIDNameInterface;

    return new Promise(async (resolve, reject) => {
      await $http
        .post(`${currentCompany.id}/products`, { ...form, attributeSetId })
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
