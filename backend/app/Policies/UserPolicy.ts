import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Customer from 'App/Models/Customer'
import Company from 'App/Models/Company'
import { accessCompany, accessCompanyUser } from 'App/Helpers/PolicyHelper'

export default class UserPolicy extends BasePolicy {
  public async view(authUser: User, requestedCompany: Company, requestedUser: User) {
    const resourcePermission = 'can_view_users'
    return await accessCompanyUser(resourcePermission, authUser, requestedCompany, requestedUser)
  }

  public async create(user: User) {}

  public async edit(authUser: User, requestedCompany: Company, requestedUser: User) {
    const resourcePermission = 'can_edit_users'
    return await accessCompanyUser(resourcePermission, authUser, requestedCompany, requestedUser)
  }

  public async delete(authUser: User, requestedCompany: Company, requestedUser: User) {
    const resourcePermission = 'can_delete_users'
    return await accessCompanyUser(resourcePermission, authUser, requestedCompany, requestedUser)
  }

  public async list(user: User, company: Company) {
    const resourcePermission = 'can_list_users'
    return await accessCompany(resourcePermission, user, company)
  }
}
