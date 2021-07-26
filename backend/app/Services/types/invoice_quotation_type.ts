import InvoiceQuotation from 'App/Models/InvoiceQuotation'

export interface InvoiceQuotationOptions {
  /**
   * Invoice/Quotation type
   */
  type?: InvoiceQuotation['type']
  /**
   * The Invoice/Quotation ID
   */
  id?: InvoiceQuotation['id']
  /**
   * The InvoiceQuotationModel
   */
  invoiceQuotationModel?: InvoiceQuotation
}
