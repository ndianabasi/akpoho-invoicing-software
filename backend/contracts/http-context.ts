import AttributeSet from 'App/Models/AttributeSet'
import CustomerAddress from 'App/Models/CustomerAddress'
import Company from 'App/Models/Company'
import Customer from 'App/Models/Customer'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import Product from 'App/Models/Product'

declare module '@ioc:Adonis/Core/HttpContext' {
  // eslint-disable-next-line no-unused-vars
  interface HttpContextContract {
    requestedCompany?: Company
    requestedCustomer?: Customer
    requestedCustomerAddress?: CustomerAddress
    requestedUser?: User
    authRole?: Role
    isGlobalUser?: boolean | null
    requestedAttributeSet?: AttributeSet
    requestedProduct?: Product
  }
}
