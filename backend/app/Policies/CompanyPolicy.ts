import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Company from 'App/Models/Company'
import PermissionHelper from '../Helpers/PermissionHelper'
import { accessCompany } from 'App/Helpers/PolicyHelper'

export default class CompanyPolicy extends BasePolicy {
  public async view(authUser: User, requestedCompany: Company) {
    const resourcePermission = 'can_view_companies'
    return await accessCompany(resourcePermission, authUser, requestedCompany)
  }

  public async create(authUser: User) {
    const resourcePermission = 'can_create_companies'
    return await PermissionHelper.hasResourcePermission({
      resourcePermission,
      user: authUser,
      loggable: true,
    })
  }

  public async edit(authUser: User, requestedCompany: Company) {
    const resourcePermission = 'can_edit_companies'
    return await accessCompany(resourcePermission, authUser, requestedCompany)
  }

  public async delete(user: User, requestedCompany: Company) {
    const resourcePermission = 'can_delete_companies'
    return await accessCompany(resourcePermission, user, requestedCompany)
  }

  public async list(authUser: User) {
    const resourcePermission = 'can_list_companies'
    return await PermissionHelper.hasResourcePermission({
      resourcePermission,
      user: authUser,
      loggable: true,
    })
  }
}
