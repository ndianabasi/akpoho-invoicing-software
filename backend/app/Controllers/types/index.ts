import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Company from 'App/Models/Company'
import Customer from 'App/Models/Customer'
import User from 'App/Models/User'
import Role from 'App/Models/Role'

export interface CustomContextContract extends HttpContextContract {
  requestedCompany?: Company
  requestedCustomer?: Customer
  requestedUser?: User
  authRole?: Role
  isGlobalUser?: boolean | null
}

export interface SortSearchParams {
  search: string
  page: number
  descending: boolean
  perPage: number
  sortBy: string
}
