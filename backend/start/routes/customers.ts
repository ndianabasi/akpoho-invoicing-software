import Route from '@ioc:Adonis/Core/Route'

// General Authenticated routes
Route.group(() => {
  Route.get(
    '/customer-titles/customer-titles-for-select',
    'CustomersController.customerTitlesForSelect'
  )
  // Alternative route for fetching a specific customer
  Route.get('/customers/:customer_id', 'CustomersController.show').middleware(
    'findRequestedCustomer'
  )
  // Alternative route to get all customers within a company.
  // Returns paginated result
  Route.get('/customers', 'CustomersController.index')

  // Delete requested customers
  Route.delete('/customers', 'CustomersController.destroy')
})
  .prefix('/v1')
  .middleware('auth')
  .middleware('findAuthRole')

// Authenticated company-specific routes
Route.group(() => {
  // Get all customers within a company. Returns paginated result
  Route.get('/:company_id/customers', 'CustomersController.index')

  // Search for customers for selections within a company
  Route.get('/:company_id/customers-for-select', 'CustomersController.customersForSelect')

  // Create a new customer within a company.
  Route.post('/:company_id/customers', 'CustomersController.store')

  // Get a specific customer within a company
  Route.get('/:company_id/customers/:customer_id', 'CustomersController.show').middleware(
    'findRequestedCustomer'
  )
  // Delete a specific customer within a company
  Route.delete('/:company_id/customers/:customer_id', 'CustomersController.destroy').middleware(
    'findRequestedCustomer'
  )

  // Get all addresses of a specific customer within a company
  Route.get(
    '/:company_id/customers/:customer_id/customer-addresses',
    'CustomerAddressesController.showAddresses'
  ).middleware('findRequestedCustomer')

  // Get all addresses for selection of a specific customer within a company
  Route.get(
    '/:company_id/customers/:customer_id/customer-addresses-for-select',
    'CustomerAddressesController.customerAddressesForSelect'
  ).middleware('findRequestedCustomer')

  // Get specific address details of a specific customer within a company
  Route.get(
    '/:company_id/customers/:customer_id/customer-addresses/:customer_address_id',
    'CustomerAddressesController.show'
  )
    .middleware('findRequestedCustomer')
    .middleware('findRequestedCustomerAddress')

  // Create a new address for a specific customer within a company
  Route.post(
    '/:company_id/customers/:customer_id/customer-addresses',
    'CustomerAddressesController.store'
  ).middleware('findRequestedCustomer')

  // Update a specific address of a specific customer within a company
  Route.patch(
    '/:company_id/customers/:customer_id/customer-addresses/:customer_address_id',
    'CustomerAddressesController.update'
  )
    .middleware('findRequestedCustomer')
    .middleware('findRequestedCustomerAddress')

  // Delete a specific customer address of a specific customer within a company
  Route.delete(
    '/:company_id/customers/:customer_id/customer-addresses/:customer_address_id',
    'CustomerAddressesController.destroy'
  )
    .middleware('findRequestedCustomer')
    .middleware('findRequestedCustomerAddress')

  // Update a specific customer within a company
  Route.patch('/:company_id/customers/:customer_id', 'CustomersController.update').middleware(
    'findRequestedCustomer'
  )
})
  .prefix('/v1')
  .middleware('auth')
  .middleware('findAuthRole')
  .middleware('findRequestedCompany')
