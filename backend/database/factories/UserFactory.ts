import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'
import CompanyFactory from './CompanyFactory'
import UserProfileFactory from './UserProfileFactory'

import Role from 'App/Models/Role'

const getRoles = await (async function () {
  const superAdminRole = await Role.findBy('name', 'SuperAdmin')
  const companyAdminRole = await Role.findBy('name', 'CompanyAdmin')
  const companyEditorRole = await Role.findBy('name', 'CompanyEditor')
  const companyStaffRole = await Role.findBy('name', 'CompanyStaff')

  return {
    superAdminRole: superAdminRole?.id,
    companyAdminRole: companyAdminRole?.id,
    companyEditorRole: companyEditorRole?.id,
    companyStaffRole: companyStaffRole?.id,
  }
})()

const UserFactory = Factory.define(User, async ({ faker }) => {
  const generatedUser = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    login_status: faker.datatype.boolean(),
    is_account_activated: faker.datatype.boolean(),
    is_email_verified: faker.datatype.boolean(),
  }

  console.log(generatedUser)

  return generatedUser
})
  .state('fullAccess', (user) => {
    user.loginStatus = user.isAccountActivated = user.isEmailVerified = true
    return user
  })
  .state('superAdmin', (user) => {
    user.roleId = getRoles.superAdminRole!
    user.loginStatus = user.isAccountActivated = user.isEmailVerified = true
    return user
  })
  .state('companyAdmin', (user) => {
    user.roleId = getRoles.companyAdminRole!
    user.loginStatus = user.isAccountActivated = user.isEmailVerified = true
    return user
  })
  .state('companyEditor', (user) => {
    user.roleId = getRoles.companyEditorRole!
    user.loginStatus = user.isAccountActivated = user.isEmailVerified = true
    return user
  })
  .state('companyStaff', (user) => {
    user.roleId = getRoles.companyStaffRole!
    user.loginStatus = user.isAccountActivated = user.isEmailVerified = true
    return user
  })
  .relation('companies', () => CompanyFactory)
  .relation('profile', () => UserProfileFactory)
  .build()

export default UserFactory
