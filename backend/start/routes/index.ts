import Route from '@ioc:Adonis/Core/Route'
import './inventories'
import './customers'

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
  Route.get('/auth/demo-login-credentials', 'AuthController.demoLoginCredentials')
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

  // Alternative route for fetching a specific user
  Route.get('/users/:user_id', 'UsersController.show').middleware('findRequestedUser')

  Route.get(
    '/company-sizes/company-sizes-for-select',
    'CompanySizesController.companySizesForSelect'
  )

  // Create a new company
  Route.post('/companies', 'CompaniesController.store')
  // Get a companies for a user
  Route.get('/companies', 'CompaniesController.index')
  // Delete requested companies
  Route.delete('/companies', 'CompaniesController.destroy')
})
  .prefix('/v1')
  .middleware('auth')
  .middleware('findAuthRole')

// Authenticated company-specific routes
Route.group(() => {
  // Get a specific company
  Route.get('/companies/:company_id', 'CompaniesController.show')
  // Edit a specific company
  Route.patch('/companies/:company_id', 'CompaniesController.update')
  // Delete a specific company
  Route.delete('/companies/:company_id', 'CompaniesController.destroy')

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
