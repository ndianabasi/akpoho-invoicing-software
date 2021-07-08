import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Company from 'App/Models/Company'
import { accessCompanyAttributeSet } from 'App/Helpers/PolicyHelper'
import AttributeSet from 'App/Models/AttributeSet'

export default class CustomerPolicy extends BasePolicy {
  public async view(
    authUser: User,
    requestedCompany: Company | null,
    requestedAttributeSet: AttributeSet
  ) {
    const resourcePermission = 'can_view_attribute_sets'
    return await accessCompanyAttributeSet(
      resourcePermission,
      authUser,
      requestedCompany ?? null,
      requestedAttributeSet
    )
  }
}
