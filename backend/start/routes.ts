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

Route.group(() => {
  Route.post('/login', 'AuthController.login')
}).prefix('/v1')

// Authenticated routes
Route.group(() => {
  Route.get('/auth-profile', 'AuthController.authProfile')

  Route.post('/logout', async ({ auth, response }) => {
    await auth.use('api').revoke()
    return response.ok({
      revoked: true,
    })
  })
})
  .prefix('/v1')
  .middleware('auth')

// Company-specific routes
Route.group(() => {
  Route.get('/:company_id/customers', 'CustomersController.index')
  Route.get('/:company_id/customers/:customer_id', 'CustomersController.show').middleware(
    'findRequestedCustomer'
  )
  Route.delete('/:company_id/customers/:customer_id', 'CustomersController.destroy').middleware(
    'findRequestedCustomer'
  )

  Route.get('/:company_id/users', 'UsersController.index')
  Route.get('/:company_id/users/:user_id', 'UsersController.show').middleware('findRequestedUser')
})
  .prefix('/v1')
  .middleware('auth')
  .middleware('findRequestedCompany')

// Non-Company-specific routes
Route.group(() => {
  Route.get('/countries/countries-for-select', 'CountriesController.countriesForSelect')

  Route.get(
    '/countries/:country_id/states-for-select',
    'CountriesController.countryStatesForSelect'
  )
})
  .prefix('/v1')
  .middleware('auth')
