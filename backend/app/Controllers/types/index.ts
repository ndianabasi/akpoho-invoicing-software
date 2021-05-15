import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Company from 'App/Models/Company'
import Customer from 'App/Models/Customer'

export interface CustomContextContract extends HttpContextContract {
  requestedCompany?: Company
  requestedCustomer?: Customer
}

export interface SortSearchParams {
  search: string
  page: number
  descending: boolean
  perPage: number
  sortBy: string
}
