import Route from '@ioc:Adonis/Core/Route'

// Company-related routes
Route.group(() => {
  // Create a new product and relate with to the company_id
  Route.post('/:company_id/quotations', 'InvoicesQuotationsController.store')
  // Get all quotations for a company. Need a type to differentiate
  // a quotation request from an invoice request
  // The type should be defined in the query string: e.g type=quotation
  Route.get('/:company_id/invoices-quotations', 'InvoicesQuotationsController.index')
})
  .prefix('/v1')
  .middleware('auth')
  .middleware('findAuthRole')
  .middleware('findRequestedCompany')
