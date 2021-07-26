import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { InvoiceQuotationStateInterface } from './state';

export type InvoiceQuotationGetterInterface = GetterTree<
  InvoiceQuotationStateInterface,
  StateInterface
>;

const getters: InvoiceQuotationGetterInterface = {
  GET_QUOTATION_FORM: (state: InvoiceQuotationStateInterface) =>
    state.quotationForm,
  GET_CURRENTLY_VIEWED_INVOICE_QUOTATION: (
    state: InvoiceQuotationStateInterface
  ) => state.currentlyViewedInvoiceQuotation,
  /* GET_QUOTATION_FORM_DATA: (state: InvoiceQuotationStateInterface) => {
    const form = state.quotationForm;
    const formData = new FormData();
    return formData;
  }, */
};

export default getters;
