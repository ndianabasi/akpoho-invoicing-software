/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/views/test', async ({ view }) => {
  return view.render('emails/new-account-verification')
}).middleware(({ view }, next) => {
  view.share({
    firstName: 'Ndianabasi',
    email: 'xyz@akpoho.com',
    link: 'https://akpoho.com/verify-email/random-verification-key',
  })

  return next()
})

Route.group(() => {
  Route.post('/auth/login', 'AuthController.login')
  // Register a new account from the public registration form
  Route.post('/auth/register', 'AuthController.register')
  Route.post('/auth/request-password-reset', 'AuthController.requestPasswordReset')
  Route.post('/auth/verify-password-reset', 'AuthController.verifyPasswordReset')
  Route.post('/auth/reset-password', 'AuthController.ResetPassword')
  Route.post('/auth/new-account-email-verification', 'AuthController.newAccountEmailVerification')

  Route.get('/countries/countries-for-select', 'CountriesController.countriesForSelect')
  Route.get(
    '/countries/:country_id/states-for-select',
    'CountriesController.countryStatesForSelect'
  )
}).prefix('/v1')

// General Authenticated routes
Route.group(() => {
  // Get the profile of the user
  Route.get('/auth/profile', 'AuthController.authProfile')
  // logout a signed-in user
  Route.post('/auth/logout', async ({ auth, response }) => {
    await auth.use('api').revoke()
    return response.ok({
      revoked: true,
    })
  })
  // Confirm the current password for password change by auth user
  Route.post('/auth/confirm-current-password', 'AuthController.confirmCurrentPassword')
  // Confirm the confirmation code for password change by auth user
  Route.post('/auth/confirm-password-change-code', 'AuthController.confirmPasswordCode')
  // Receive and update new password for auth user
  Route.post('/auth/submit-new-password', 'AuthController.submitNewPassword')
  // Allow user to request for email verification if
  // previous one was not received
  Route.post('/auth/request-email-verification', 'AuthController.requestEmailVerification')

  Route.get('/roles/roles-for-select', 'RolesController.rolesForSelect')
  Route.get('/roles/global-roles', 'RolesController.globalRoles')

  // Permissions routes
  Route.get('/permissions/user-permissions', 'PermissionsController.userPermissions')

  Route.get(
    '/customer-titles/customer-titles-for-select',
    'CustomersController.customerTitlesForSelect'
  )

  // Alternative route for fetching a specific user
  Route.get('/users/:user_id', 'UsersController.show').middleware('findRequestedUser')
  // Alternative route for fetching a specific customer
  Route.get('/customers/:customer_id', 'CustomersController.show').middleware(
    'findRequestedCustomer'
  )
  // Alternative route to get all customers within a company.
  // Returns paginated result
  Route.get('/customers', 'CustomersController.index')

  Route.get(
    '/company-sizes/company-sizes-for-select',
    'CompanySizesController.companySizesForSelect'
  )

  // Create a new company
  Route.post('/companies', 'CompaniesController.store')
  Route.get('/companies', 'CompaniesController.index')
})
  .prefix('/v1')
  .middleware('auth')
  .middleware('findAuthRole')

// Authenticated company-specific routes
Route.group(() => {
  // Customers routes
  // Get a specific company
  Route.get('/companies/:company_id', 'CompaniesController.show')
  // Edit a specific company
  Route.patch('/companies/:company_id', 'CompaniesController.update')
  // Delete a specific company
  Route.delete('/companies/:company_id', 'CompaniesController.destroy')

  // Get all customers within a company. Returns paginated result
  Route.get('/:company_id/customers', 'CustomersController.index')
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
    'CustomersController.showAddresses'
  ).middleware('findRequestedCustomer')
  // Get a specific address details of a specific customer within a company
  Route.get(
    '/:company_id/customers/:customer_id/customer-addresses/:customer_address_id',
    'CustomersController.showAddress'
  )
    .middleware('findRequestedCustomer')
    .middleware('findRequestedCustomerAddress')
  // Create a new address for a specific customer within a company
  Route.post(
    '/:company_id/customers/:customer_id/customer-addresses',
    'CustomersController.storeAddress'
  ).middleware('findRequestedCustomer')
  // Update a specific address of a specific customer within a company
  Route.patch(
    '/:company_id/customers/:customer_id/customer-addresses/:customer_address_id',
    'CustomersController.updateAddress'
  )
    .middleware('findRequestedCustomer')
    .middleware('findRequestedCustomerAddress')
  // Delete a specific customer address of a specific customer within a company
  Route.delete(
    '/:company_id/customers/:customer_id/customer-addresses/:customer_address_id',
    'CustomersController.destroyAddress'
  )
    .middleware('findRequestedCustomer')
    .middleware('findRequestedCustomerAddress')

  // Update a specific customer within a company
  Route.patch('/:company_id/customers/:customer_id', 'CustomersController.update').middleware(
    'findRequestedCustomer'
  )

  // Users routes
  Route.get('/:company_id/users', 'UsersController.index')

  Route.get('/:company_id/users/:user_id', 'UsersController.show').middleware('findRequestedUser')

  Route.patch('/:company_id/users/:user_id', 'UsersController.update').middleware(
    'findRequestedUser'
  )

  Route.delete('/:company_id/users/:user_id', 'UsersController.destroy').middleware(
    'findRequestedUser'
  )

  Route.post('/:company_id/users', 'UsersController.store')
})
  .prefix('/v1')
  .middleware('auth')
  .middleware('findAuthRole')
  .middleware('findRequestedCompany')
