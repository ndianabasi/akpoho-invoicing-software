declare module '@ioc:Adonis/Core/HttpContext' {
  import CustomerAddress from 'App/Models/CustomerAddress'
  import Company from 'App/Models/Company'
  import Customer from 'App/Models/Customer'
  import User from 'App/Models/User'
  import Role from 'App/Models/Role'

  interface HttpContextContract {
    requestedCompany?: Company
    requestedCustomer?: Customer
    requestedCustomerAddress?: CustomerAddress
    requestedUser?: User
    authRole?: Role
    isGlobalUser?: boolean | null
  }
}
