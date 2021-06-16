'use strict'
import User from 'App/Models/User'
import Customer from 'App/Models/Customer'
import PermissionHelper from '../Helpers/PermissionHelper'
import Company from 'App/Models/Company'
import Bouncer from '@ioc:Adonis/Addons/Bouncer'

const accessCompany = async (resourcePermission: string, authUser: User, company: Company) => {
  const isPermitted = await PermissionHelper.hasResourcePermission({
    resourcePermission,
    user: authUser,
    loggable: true,
  })

  await authUser.load('companies')
  const serialisedUser = authUser.serialize()

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
  authUser: User,
  requestedCompany: Company | null,
  requestedUser: User
) => {
  const isPermitted = await PermissionHelper.hasResourcePermission({
    resourcePermission,
    user: authUser,
    loggable: true,
  })

  const authUserCompanyIds = await serialisedAuthUserCompanyIds(authUser)

  await requestedUser.load('companies')
  const reqUserCompanies = requestedUser.companies
  const serialisedReqUserCompanyIds = reqUserCompanies.map((company) => {
    company.serialize()
    return company.id
  })

  /* console.log({
    authUserCompanyIds,
    serialisedReqUserCompanyIds,
  }) */

  if (!requestedCompany) {
    // If no requested company, check if the requested user and
    // auth user belong to the same company
    const belongToSameCompany = authUserCompanyIds.some(
      (authUserCompanyId) =>
        serialisedReqUserCompanyIds[serialisedReqUserCompanyIds.indexOf(authUserCompanyId)]
    )
    //console.log(belongToSameCompany)

    return belongToSameCompany
  } else {
    if (
      authUserCompanyIds.some((authCompanyId) => authCompanyId === requestedCompany.id) &&
      reqUserCompanies.some((reqCompany) => reqCompany.id === requestedCompany.id) &&
      isPermitted
    ) {
      return true
    }
  }

  return Bouncer.deny('You are not permitted to perform this action!')
}

/**
 * Helper function to determine access to a requested company, customer,
 * as permitted by the resource permission
 * @param resourcePermission The resource permission required for the operation
 * @param authUser The authenticated user
 * @param requestedCompany The company whose access is being requested
 * @param requestedCustomer The customer whose access is being requested
 * @returns {Boolean} True/false
 */
const accessCompanyCustomer = async (
  resourcePermission: string,
  authUser: User,
  requestedCompany: Company | null,
  requestedCustomer: Customer
) => {
  const isPermitted = await PermissionHelper.hasResourcePermission({
    resourcePermission,
    user: authUser,
    loggable: true,
  })

  const authUserCompanyIds = await serialisedAuthUserCompanyIds(authUser)

  if (!requestedCompany) {
    // If no requested company, check if the requested customer and
    // auth user belong to the same company
    const belongToSameCompany = authUserCompanyIds.some(
      (authUserCompanyId) => authUserCompanyId === requestedCustomer.companyId
    )
    //console.log(belongToSameCompany)

    return belongToSameCompany
  } else {
    if (
      authUserCompanyIds.some((authCompanyId) => authCompanyId === requestedCompany?.id) &&
      requestedCustomer.companyId === requestedCompany?.id &&
      isPermitted
    ) {
      return true
    }
  }

  return Bouncer.deny('You are not permitted to perform this action!')
}

const serialisedAuthUserCompanyIds = async function (authUser: User) {
  await authUser.load('companies')
  const authUserCompanies = authUser.companies
  if (!authUserCompanies.length) return []
  const serialisedUser = authUserCompanies.map((company) => {
    company.serialize()
    return company.id
  })
  return serialisedUser
}

export { accessCompany, accessCompanyUser, accessCompanyCustomer }
