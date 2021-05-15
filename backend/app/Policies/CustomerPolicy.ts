import Bouncer, { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Customer from 'App/Models/Customer'
import PermissionHelper from '../Helpers/PermissionHelper'
import Company from 'App/Models/Company'

export default class CustomerPolicy extends BasePolicy {
  public async view(user: User, company: Company, customer: Customer) {
    const resourcePermission = 'can_view_customers'
    return await accessCompanyCustomer(resourcePermission, user, company, customer)
  }

  public async create(user: User) {}

  public async update(user: User, Customer: Customer) {}

  public async delete(user: User, company: Company, customer: Customer) {
    const resourcePermission = 'can_delete_customers'
    return await accessCompanyCustomer(resourcePermission, user, company, customer)
  }

  public async list(user: User, company: Company) {
    const resourcePermission = 'can_list_customers'
    return await accessCompany(resourcePermission, user, company)
  }
}

const accessCompanyCustomer = async (
  resourcePermission: string,
  user: User,
  company: Company,
  customer: Customer
) => {
  const isPermitted = await PermissionHelper.hasResourcePermission({
    resourcePermission,
    user,
    loggable: true,
  })

  await user.load('companies')
  const serialisedUser = user.toJSON()

  if (
    serialisedUser.companies.some((serialisedCompany) => serialisedCompany.id === company.id) &&
    customer.companyId === company.id &&
    isPermitted
  ) {
    return true
  }

  return Bouncer.deny('You are permitted to perform this action!')
}

const accessCompany = async (resourcePermission: string, user: User, company: Company) => {
  const isPermitted = await PermissionHelper.hasResourcePermission({
    resourcePermission,
    user,
    loggable: true,
  })

  await user.load('companies')
  const serialisedUser = user.toJSON()

  if (
    serialisedUser.companies.some((serialisedCompany) => serialisedCompany.id === company.id) &&
    isPermitted
  ) {
    return true
  }

  return Bouncer.deny('You are permitted to perform this action!')
}
