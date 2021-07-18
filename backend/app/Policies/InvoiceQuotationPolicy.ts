import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import PermissionHelper from 'App/Helpers/PermissionHelper'
import Bouncer from '@ioc:Adonis/Addons/Bouncer'
import { accessInvoicesQuotations } from 'App/Helpers/PolicyHelper'
import InvoiceQuotation from 'App/Models/InvoiceQuotation'
import Company from 'App/Models/Company'

export default class ProductPolicy extends BasePolicy {
  public async create(user: User) {
    // Access to requested company is ascertain in the FindRequestedCompany
    // middleware
    const resourcePermission = 'can_create_quotations'
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
    const resourcePermission = 'can_list_quotations'
    const isPermitted = await PermissionHelper.hasResourcePermission({
      resourcePermission,
      user,
      loggable: true,
    })

    if (isPermitted) return true

    return Bouncer.deny('You are not permitted to perform this action!')
  }

  public async view(
    user: User,
    requestedInvoiceQuotation: InvoiceQuotation,
    requestedCompany: Company
  ) {
    const resourcePermission = 'can_view_quotations'
    return await accessInvoicesQuotations(
      resourcePermission,
      user,
      requestedInvoiceQuotation,
      requestedCompany
    )
  }

  public async edit(
    user: User,
    requestedInvoiceQuotation: InvoiceQuotation,
    requestedCompany: Company
  ) {
    const resourcePermission = 'can_edit_quotations'
    return await accessInvoicesQuotations(
      resourcePermission,
      user,
      requestedInvoiceQuotation,
      requestedCompany
    )
  }
}
