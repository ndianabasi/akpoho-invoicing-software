import { MutationTree } from 'vuex';
import { InvoiceQuotationStateInterface } from './state';
import {
  CurrentlyViewedInvoiceQuotation,
  QuotationInvoiceFormShape,
} from '../types';

const mutation: MutationTree<InvoiceQuotationStateInterface> = {
  SET_QUOTATION_FORM(
    state: InvoiceQuotationStateInterface,
    payload: QuotationInvoiceFormShape
  ) {
    state.quotationForm = payload;
  },

  SET_CURRENTLY_VIEWED_INVOICE_QUOTATION(
    state: InvoiceQuotationStateInterface,
    payload: CurrentlyViewedInvoiceQuotation
  ) {
    state.currentlyViewedInvoiceQuotation = payload;
  },
};

export default mutation;
