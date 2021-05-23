import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Company from 'App/Models/Company'
import Customer from 'App/Models/Customer'
import User from 'App/Models/User'

export interface CustomContextContract extends HttpContextContract {
  requestedCompany?: Company
  requestedCustomer?: Customer
  requestedUser?: User
}

export interface SortSearchParams {
  search: string
  page: number
  descending: boolean
  perPage: number
  sortBy: string
}
