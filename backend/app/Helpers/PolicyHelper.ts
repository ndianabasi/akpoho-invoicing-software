'use strict'
import User from 'App/Models/User'
import Customer from 'App/Models/Customer'
import PermissionHelper from '../Helpers/PermissionHelper'
import Company from 'App/Models/Company'
import Bouncer from '@ioc:Adonis/Addons/Bouncer'

const accessCompany = async (resourcePermission: string, user: User, company: Company) => {
  const isPermitted = await PermissionHelper.hasResourcePermission({
    resourcePermission,
    user,
    loggable: true,
  })

  await user.load('companies')
  const serialisedUser = user.toJSON()

  if (
    serialisedUser.companies.some((serialisedCompany) => serialisedCompany.id === company.id) &&
    isPermitted
  ) {
    return true
  }

  return Bouncer.deny('You are not permitted to perform this action!')
}

const accessCompanyUser = async (
  resourcePermission: string,
  user: User,
  company: Company,
  customer: Customer
) => {
  const isPermitted = await PermissionHelper.hasResourcePermission({
    resourcePermission,
    user,
    loggable: true,
  })

  await user.load('companies')
  const serialisedUser = user.toJSON()

  if (
    serialisedUser.companies.some((serialisedCompany) => serialisedCompany.id === company.id) &&
    customer.companyId === company.id &&
    isPermitted
  ) {
    return true
  }

  return Bouncer.deny('You are not permitted to perform this action!')
}

const accessCompanyCustomer = async (
  resourcePermission: string,
  user: User,
  company: Company,
  customer: Customer
) => {
  const isPermitted = await PermissionHelper.hasResourcePermission({
    resourcePermission,
    user,
    loggable: true,
  })

  await user.load('companies')
  const serialisedUser = user.toJSON()

  if (
    serialisedUser.companies.some((serialisedCompany) => serialisedCompany.id === company.id) &&
    customer.companyId === company.id &&
    isPermitted
  ) {
    return true
  }

  return Bouncer.deny('You are not permitted to perform this action!')
}

export { accessCompany, accessCompanyUser, accessCompanyCustomer }
