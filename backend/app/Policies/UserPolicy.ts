import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Company from 'App/Models/Company'
import { accessCompany, accessCompanyUser } from 'App/Helpers/PolicyHelper'

export default class UserPolicy extends BasePolicy {
  public async view(authUser: User, requestedCompany: Company | null, requestedUser: User) {
    if (authUser.id === requestedUser.id) return true
    const resourcePermission = 'can_view_users'
    return await accessCompanyUser(
      resourcePermission,
      authUser,
      requestedCompany ?? null,
      requestedUser
    )
  }

  public async create(user: User, company: Company) {
    const resourcePermission = 'can_create_users'
    return await accessCompany(resourcePermission, user, company)
  }

  public async edit(authUser: User, requestedCompany: Company | null, requestedUser: User) {
    if (authUser.id === requestedUser.id) return true
    const resourcePermission = 'can_edit_users'
    return await accessCompanyUser(resourcePermission, authUser, requestedCompany, requestedUser)
  }

  public async delete(authUser: User, requestedCompany: Company | null, requestedUser: User) {
    const resourcePermission = 'can_delete_users'
    return await accessCompanyUser(resourcePermission, authUser, requestedCompany, requestedUser)
  }

  public async list(user: User, company: Company) {
    const resourcePermission = 'can_list_users'
    return await accessCompany(resourcePermission, user, company)
  }
}
