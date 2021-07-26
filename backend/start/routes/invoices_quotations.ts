import Route from '@ioc:Adonis/Core/Route'

// Company-related routes
Route.group(() => {
  // Create a invoice/quotation for a company. Need a type to differentiate
  // a quotation request from an invoice request
  // The type should be defined in the query string: e.g type=quotation
  Route.post('/:company_id/invoices-quotations', 'InvoicesQuotationsController.store')
  // Update an invoice/quotation for a company. Need a type to differentiate
  // a quotation request from an invoice request
  // The type should be defined in the query string: e.g type=quotation
  Route.patch(
    '/:company_id/invoices-quotations/:invoice_quotation_id',
    'InvoicesQuotationsController.update'
  ).middleware('findRequestedInvoiceQuotation')
  // Get all quotations for a company. Need a type to differentiate
  // a quotation request from an invoice request
  // The type should be defined in the query string: e.g type=quotation
  Route.get('/:company_id/invoices-quotations', 'InvoicesQuotationsController.index')
  // Get data for a single quotation or invoice
  // The type should be defined in the query string
  Route.get(
    '/:company_id/invoices-quotations/:invoice_quotation_id',
    'InvoicesQuotationsController.show'
  ).middleware('findRequestedInvoiceQuotation')
  Route.get(
    '/:company_id/invoices-quotations/:invoice_quotation_id/download',
    'InvoicesQuotationsController.download'
  ).middleware('findRequestedInvoiceQuotation')
})
  .prefix('/v1')
  .middleware('auth')
  .middleware('findAuthRole')
  .middleware('findRequestedCompany')

Route.group(() => {
  Route.get(
    '/print-invoices-quotations/:invoice_quotation_id/:type',
    'InvoicesQuotationsController.print'
  )
}).prefix('/print-pages')
