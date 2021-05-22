import Bouncer, { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Customer from 'App/Models/Customer'
import PermissionHelper from '../Helpers/PermissionHelper'
import Company from 'App/Models/Company'
import { accessCompany, accessCompanyUser } from 'App/Helpers/PolicyHelper'

export default class CustomerPolicy extends BasePolicy {
  public async view(user: User, company: Company, customer: Customer) {
    const resourcePermission = 'can_view_users'
    return await accessCompanyUser(resourcePermission, user, company, customer)
  }

  public async create(user: User) {}

  public async update(user: User, Customer: Customer) {}

  public async delete(user: User, company: Company, customer: Customer) {
    const resourcePermission = 'can_delete_users'
    return await accessCompanyUser(resourcePermission, user, company, customer)
  }

  public async list(user: User, company: Company) {
    const resourcePermission = 'can_list_users'
    return await accessCompany(resourcePermission, user, company)
  }
}
