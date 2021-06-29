import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import PermissionHelper from 'App/Helpers/PermissionHelper'
import Bouncer from '@ioc:Adonis/Addons/Bouncer'
import Product from 'App/Models/Product'
import { accessProducts } from 'App/Helpers/PolicyHelper'

export default class ProductPolicy extends BasePolicy {
  public async create(user: User) {
    // Access to requested company is ascertain in the FindRequestedCompany
    // middleware
    const resourcePermission = 'can_create_inventories'
    const isPermitted = await PermissionHelper.hasResourcePermission({
      resourcePermission,
      user,
      loggable: true,
    })

    if (isPermitted) return true

    return Bouncer.deny('You are not permitted to perform this action!')
  }

  public async list(user: User) {
    // Access to requested company is ascertain in the FindRequestedCompany
    // middleware
    const resourcePermission = 'can_list_inventories'
    const isPermitted = await PermissionHelper.hasResourcePermission({
      resourcePermission,
      user,
      loggable: true,
    })

    if (isPermitted) return true

    return Bouncer.deny('You are not permitted to perform this action!')
  }

  public async view(user: User, requestedProduct: Product) {
    const resourcePermission = 'can_view_inventories'
    return await accessProducts(resourcePermission, user, requestedProduct)
  }

  public async edit(user: User, requestedProduct: Product) {
    const resourcePermission = 'can_edit_inventories'
    return await accessProducts(resourcePermission, user, requestedProduct, 'edit')
  }
}
