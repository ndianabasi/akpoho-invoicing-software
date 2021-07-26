import {
  CurrentlyViewedInvoiceQuotation,
  /* ProductResultRowInterface, */ QuotationInvoiceFormShape,
} from '../../types';

export interface InvoiceQuotationStateInterface {
  quotationForm: QuotationInvoiceFormShape | Record<string, unknown>;
  currentlyViewedInvoiceQuotation: CurrentlyViewedInvoiceQuotation | null;
}

function state(): InvoiceQuotationStateInterface {
  return {
    quotationForm: {},
    currentlyViewedInvoiceQuotation: null,
  };
}

export default state;
