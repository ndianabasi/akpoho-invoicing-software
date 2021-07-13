/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { InvoiceQuotationStateInterface /* Users */ } from './state';
import { api as $http } from '../../boot/http';
import { HttpError, HttpResponse, StringIDNameInterface } from '../types';
import { Notify } from 'quasar';

const actions: ActionTree<InvoiceQuotationStateInterface, StateInterface> = {
  async CREATE_QUOTATION({ rootGetters }, form: { [index: string]: unknown }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const currentCompany = rootGetters[
      'auth/GET_CURRENT_COMPANY'
    ] as StringIDNameInterface;

    return new Promise(async (resolve, reject) => {
      await $http
        .post(`${currentCompany.id}/quotations`, { ...form })
        .then((res: HttpResponse) => {
          Notify.create({
            message: 'Quotation was successfully created',
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

  async EDIT_PRODUCT(
    ctx,
    {
      form,
      productId,
    }: {
      form: { [index: string]: unknown };
      attributeSetId: string;
      productId: string;
    }
  ) {
    return new Promise(async (resolve, reject) => {
      await $http
        .patch(`/products/${productId}`, { ...form })
        .then((res: HttpResponse) => {
          Notify.create({
            message: 'Product was successfully edited',
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

  async FETCH_CURRENTLY_VIEWED_INVOICE_QUOTATION(
    { commit, rootGetters },
    { id, queryString }: { id: string; queryString: Record<string, string> }
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const currentCompany = rootGetters[
      'auth/GET_CURRENT_COMPANY'
    ] as StringIDNameInterface;

    return new Promise(async (resolve) => {
      await $http
        .get(`${currentCompany.id}/invoices-quotations/${id}`, {
          params: queryString,
        })
        .then((res: HttpResponse) => {
          commit('SET_CURRENTLY_VIEWED_INVOICE_QUOTATION', res.data.data);

          resolve(res.data);
        });
    });
  },
};

export default actions;
