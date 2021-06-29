'use strict'
import User from 'App/Models/User'
import Customer from 'App/Models/Customer'
import PermissionHelper from '../Helpers/PermissionHelper'
import Company from 'App/Models/Company'
import Bouncer from '@ioc:Adonis/Addons/Bouncer'
import AttributeSet from 'App/Models/AttributeSet'
import Product from 'App/Models/Product'

const accessCompany = async (
  resourcePermission: string,
  authUser: User,
  requestedCompany: Company
) => {
  const isPermitted = await PermissionHelper.hasResourcePermission({
    resourcePermission,
    user: authUser,
    loggable: true,
  })

  await authUser.load('companies')
  const serialisedUser = authUser.serialize()

  if (
    serialisedUser.companies.some(
      (serialisedCompany) => serialisedCompany.id === requestedCompany.id
    ) &&
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

    return belongToSameCompany && isPermitted
  } else {
    if (
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

    return belongToSameCompany && isPermitted
  } else {
    if (requestedCustomer.companyId === requestedCompany?.id && isPermitted) {
      return true
    }
  }

  return Bouncer.deny('You are not permitted to perform this action!')
}

export const accessCustomers = async (
  resourcePermission: string,
  authUser: User,
  customers: Customer | string[]
) => {
  const resourcePermitted = await PermissionHelper.hasResourcePermission({
    resourcePermission,
    user: authUser,
    loggable: true,
  })

  await authUser.load('companies')
  const authUserCompanies = authUser.companies

  if (customers && Array.isArray(customers)) {
    /**
     * Array to hold each permitted customer
     */
    const permitted: boolean[] = []

    for (let i = 0; i < customers.length; i++) {
      const customerId = customers[i]
      const customer = await Customer.findOrFail(customerId)

      // Load customer company
      await customer.load('company')
      const customerCompany = customer.company

      if (
        authUserCompanies.some((authUserCompany) => authUserCompany.id === customerCompany.id) &&
        resourcePermitted
      ) {
        permitted.push(true)
      } else permitted.push(false)
    }
    if (permitted.every((value) => value === true)) return true
    else return Bouncer.deny('You are not permitted to perform this action!')
  } else {
    const customer = customers
    // Load customer company
    await customer.load('company')
    const customerCompany = customer.company

    if (
      authUserCompanies.some((authUserCompany) => authUserCompany.id === customerCompany.id) &&
      resourcePermitted
    ) {
      return true
    } else return Bouncer.deny('You are not permitted to perform this action!')
  }
}

/**
 * Checks if the authenticated user has access to the requested products
 * @param resourcePermission The resource permission
 * @param authUser The authenticated user
 * @param requestedCompany The company whose product(s) are requested
 * @param requestedProducts An array of Products or Product IDs
 * @returns {boolean} Returns true/false
 */
export const accessProducts = async (
  resourcePermission: string,
  authUser: User,
  requestedCompany: Company,
  requestedProducts: Product | string[]
) => {
  const resourcePermitted = await PermissionHelper.hasResourcePermission({
    resourcePermission,
    user: authUser,
    loggable: true,
  })

  if (requestedProducts && Array.isArray(requestedProducts)) {
    if (requestedProducts.every((product) => typeof product === 'string')) {
      /**
       * Array to hold each permitted customer
       */
      const permitted: boolean[] = []

      for (let i = 0; i < requestedProducts.length; i++) {
        const productId = requestedProducts[i]
        const product = await Product.findOrFail(productId)

        // Load product companies
        await product.load('companies')
        const productCompanies = product.companies
        const productCompaniesIds: string[] = productCompanies.map((company) => company.id)

        if (
          productCompaniesIds.some(
            (productCompanyId) => productCompanyId === requestedCompany.id
          ) &&
          resourcePermitted
        ) {
          permitted.push(true)
        } else permitted.push(false)
      }
      if (permitted.every((value) => value)) return true
      else return Bouncer.deny('You are not permitted to perform this action!')
      //
    } else throw new Error('Array of string ids expected')
  } else {
    const product = requestedProducts
    // Load product companies
    await product.load('companies')
    const productCompanies = product.companies
    const productCompaniesIds: string[] = productCompanies.map((company) => company.id)

    if (
      productCompaniesIds.some((productCompanyId) => productCompanyId === requestedCompany.id) &&
      resourcePermitted
    ) {
      return true
    } else return Bouncer.deny('You are not permitted to perform this action!')
  }
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

const serialisedAttributeSetCompanyIds = async function (attributeSet: AttributeSet) {
  await attributeSet.load('companies')
  const attributeSetCompanies = attributeSet.companies
  if (!attributeSetCompanies.length) return []
  const serialisedIds = attributeSetCompanies.map((company) => {
    company.serialize()
    return company.id
  })
  return serialisedIds
}

/**
 * Helper function to determine access to a requested company
 * and attribute set, as permitted by the resource permission
 * @param resourcePermission The resource permission required for the operation
 * @param authUser The authenticated user
 * @param requestedCompany The company whose access is being requested
 * @param requestedAttributeSet The customer whose access is being requested
 * @returns {Boolean} True/false
 */
export const accessCompanyAttributeSet = async (
  resourcePermission: string,
  authUser: User,
  requestedCompany: Company | null,
  requestedAttributeSet: AttributeSet
) => {
  const isPermitted = await PermissionHelper.hasResourcePermission({
    resourcePermission,
    user: authUser,
    loggable: true,
  })

  if (requestedAttributeSet.isSystem) {
    return isPermitted
  }

  const authUserCompanyIds = await serialisedAuthUserCompanyIds(authUser)

  const attributeSetCompanyIds = await serialisedAttributeSetCompanyIds(requestedAttributeSet)

  if (!requestedCompany) {
    // If no requested company, check if the requested attribute and
    // auth user belong to the same company
    const belongToSameCompany = authUserCompanyIds.some(
      (authUserCompanyId) =>
        attributeSetCompanyIds[attributeSetCompanyIds.indexOf(authUserCompanyId)]
    )

    return belongToSameCompany && isPermitted
  } else {
    if (
      authUserCompanyIds.some((authCompanyId) => authCompanyId === requestedCompany?.id) &&
      authUserCompanyIds.some(
        (authUserCompanyId) =>
          attributeSetCompanyIds[attributeSetCompanyIds.indexOf(authUserCompanyId)]
      ) &&
      isPermitted
    ) {
      return true
    }
  }

  return Bouncer.deny('You are not permitted to perform this action!')
}

export { accessCompany, accessCompanyUser, accessCompanyCustomer }
