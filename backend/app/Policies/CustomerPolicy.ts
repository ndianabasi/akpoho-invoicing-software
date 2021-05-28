import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Customer from 'App/Models/Customer'
import Company from 'App/Models/Company'
import { accessCompany, accessCompanyCustomer } from 'App/Helpers/PolicyHelper'

export default class CustomerPolicy extends BasePolicy {
  public async view(user: User, company: Company, customer: Customer) {
    const resourcePermission = 'can_view_customers'
    return await accessCompanyCustomer(resourcePermission, user, company, customer)
  }

  public async create(user: User) {}

  public async edit(user: User, Customer: Customer) {}

  public async delete(user: User, company: Company, customer: Customer) {
    const resourcePermission = 'can_delete_customers'
    return await accessCompanyCustomer(resourcePermission, user, company, customer)
  }

  public async list(user: User, company: Company) {
    const resourcePermission = 'can_list_customers'
    return await accessCompany(resourcePermission, user, company)
  }
}
