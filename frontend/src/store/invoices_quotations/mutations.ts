import { MutationTree } from 'vuex';
import { InvoiceQuotationStateInterface } from './state';
import { QuotationInvoiceFormShape } from '../types';

const mutation: MutationTree<InvoiceQuotationStateInterface> = {
  SET_QUOTATION_FORM(
    state: InvoiceQuotationStateInterface,
    payload: QuotationInvoiceFormShape
  ) {
    state.quotationForm = payload;
  },

  /* SET_CURRENTLY_VIEWED_QUOTATION(
    state: InvoiceQuotationStateInterface,
    payload: ProductResultRowInterface
  ) {
    state.currentlyViewedProduct = payload;
  }, */
};

export default mutation;
