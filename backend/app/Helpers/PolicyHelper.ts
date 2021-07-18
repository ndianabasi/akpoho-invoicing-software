'use strict'
import User from 'App/Models/User'
import Customer from 'App/Models/Customer'
import PermissionHelper from '../Helpers/PermissionHelper'
import Company from 'App/Models/Company'
import Bouncer from '@ioc:Adonis/Addons/Bouncer'
import AttributeSet from 'App/Models/AttributeSet'
import Product from 'App/Models/Product'
import InvoiceQuotation from 'App/Models/InvoiceQuotation'

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
 * @returns {Promise<boolean>} Returns true/false
 */
export const accessProducts = async (
  resourcePermission: string,
  authUser: User,
  requestedProducts: Product | string[],
  mode: 'edit' | 'view' = 'view'
): Promise<boolean | [string, number]> => {
  const resourcePermitted = await PermissionHelper.hasResourcePermission({
    resourcePermission,
    user: authUser,
    loggable: true,
  })

  const authUserCompanyIds = await serialisedAuthUserCompanyIds(authUser)

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

        // Check is user belongs to any of the product companies
        const belongToSameCompany = authUserCompanyIds.some(
          (authUserCompanyId) => productCompaniesIds[productCompaniesIds.indexOf(authUserCompanyId)]
        )

        if (mode === 'view') {
          if (belongToSameCompany && resourcePermitted) {
            permitted.push(true)
          } else permitted.push(false)
        } else {
          // Check if user belongs to a company which can edit the product
          // 1. Get the company with `edit` privilege for the product
          const companyWithEditAccess = await product
            .related('companies')
            .query()
            .whereInPivot('ownership', ['owner'])
            .first()

          // 2. Now check if the authUser belongs to this company
          const authUserBelongsToEditAccessCompany = authUserCompanyIds.some(
            (authUserCompanyId) => authUserCompanyId === companyWithEditAccess?.id
          )

          if (belongToSameCompany && authUserBelongsToEditAccessCompany && resourcePermitted) {
            permitted.push(true)
          } else permitted.push(false)
        }
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

    // Check is user belongs to any of the product companies
    const belongToSameCompany = authUserCompanyIds.some(
      (authUserCompanyId) => productCompaniesIds[productCompaniesIds.indexOf(authUserCompanyId)]
    )

    if (mode === 'view') {
      if (belongToSameCompany && resourcePermitted) {
        return true
      } else return Bouncer.deny('You are not permitted to perform this action!')
    } else {
      // Check if user belongs to a company which can edit the product
      // 1. Get the company with `edit` privilege for the product
      const companyWithEditAccess = await product
        .related('companies')
        .query()
        .whereInPivot('ownership', ['owner'])
        .first()

      // 2. Now check if the authUser belongs to this company
      const authUserBelongsToEditAccessCompany = authUserCompanyIds.some(
        (authUserCompanyId) => authUserCompanyId === companyWithEditAccess?.id
      )

      if (belongToSameCompany && authUserBelongsToEditAccessCompany && resourcePermitted) {
        return true
      } else return Bouncer.deny('You are not permitted to perform this action!')
    }
  }
}

export const accessInvoicesQuotations = async (
  resourcePermission: string,
  authUser: User,
  invoices_quotations: InvoiceQuotation | string[],
  ownerCompany: Company
) => {
  const resourcePermitted = await PermissionHelper.hasResourcePermission({
    resourcePermission,
    user: authUser,
    loggable: true,
  })

  await authUser.load('companies')
  const authUserCompanies = authUser.companies

  if (invoices_quotations && Array.isArray(invoices_quotations)) {
    /**
     * Array to hold each permitted invoice_quotation
     */
    const permitted: boolean[] = []

    for (let i = 0; i < invoices_quotations.length; i++) {
      const invoiceQuotationId = invoices_quotations[i]
      const invoiceQuotation = await InvoiceQuotation.findOrFail(invoiceQuotationId)

      // Load invoice_quotation company
      await invoiceQuotation.load('company')
      const invoiceQuotationCompany = invoiceQuotation.company

      if (invoiceQuotationCompany.id !== ownerCompany.id) {
        permitted.push(false)
        continue
      }

      if (
        authUserCompanies.some(
          (authUserCompany) => authUserCompany.id === invoiceQuotationCompany.id
        ) &&
        resourcePermitted
      ) {
        permitted.push(true)
      } else permitted.push(false)
    }
    if (permitted.every((value) => value === true)) return true
    else return Bouncer.deny('You are not permitted to perform this action!')
  } else {
    const invoiceQuotation = invoices_quotations
    // Load invoice_quotation company
    await invoiceQuotation.load('company')
    const invoiceQuotationCompany = invoiceQuotation.company

    if (invoiceQuotationCompany.id !== ownerCompany.id) {
      return Bouncer.deny(
        'You are not permitted to perform this action! Make sure you have selected the right company.'
      )
    }

    if (
      authUserCompanies.some(
        (authUserCompany) => authUserCompany.id === invoiceQuotationCompany.id
      ) &&
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
