import Route from '@ioc:Adonis/Core/Route'

// Company-related routes
Route.group(() => {
  // Create a new product and relate with to the company_id
  Route.post('/:company_id/quotations', 'InvoicesQuotationsController.store')
})
  .prefix('/v1')
  .middleware('auth')
  .middleware('findAuthRole')
  .middleware('findRequestedCompany')
