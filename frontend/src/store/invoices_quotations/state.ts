import {
  /* ProductResultRowInterface, */ QuotationInvoiceFormShape,
} from '../types';

export interface InvoiceQuotationStateInterface {
  quotationForm: QuotationInvoiceFormShape | Record<string, unknown>;
  //currentlyViewedQuotation: ProductResultRowInterface | null;
}

function state(): InvoiceQuotationStateInterface {
  return {
    quotationForm: {},
    //currentlyViewedQuotation: null,
  };
}

export default state;
