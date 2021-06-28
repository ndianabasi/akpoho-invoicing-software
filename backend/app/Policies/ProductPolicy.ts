import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Company from 'App/Models/Company'
import { accessCompany } from 'App/Helpers/PolicyHelper'

export default class ProductPolicy extends BasePolicy {
  public async create(user: User, company: Company) {
    const resourcePermission = 'can_create_inventories'
    return await accessCompany(resourcePermission, user, company)
  }
}
