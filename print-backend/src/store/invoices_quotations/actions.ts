/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { InvoiceQuotationStateInterface /* Users */ } from './state';
import { api as $http } from '../../boot/axios';
import { HttpError, HttpResponse, InvoiceQuotationType } from '../../types';

const actions: ActionTree<InvoiceQuotationStateInterface, StateInterface> = {
  async FETCH_CURRENTLY_VIEWED_INVOICE_QUOTATION(
    { commit },
    { id, type }: { id: string; type: InvoiceQuotationType }
  ) {
    return new Promise(async (resolve) => {
      await $http
        .get(`print-pages/print-invoices-quotations/${id}/${type}`)
        .then((res: HttpResponse) => {
          commit('SET_CURRENTLY_VIEWED_INVOICE_QUOTATION', res.data.data);

          resolve(res.data);
        })
        .catch((error: HttpError) => {
          console.log({
            status: error.response?.status,
            statusText: error.response?.statusText,
          });
        });
    });
  },
};

export default actions;
