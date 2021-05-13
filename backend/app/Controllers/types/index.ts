import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Company from 'App/Models/Company'

export interface CustomContextContract extends HttpContextContract {
  requestedCompany?: Company
}

export interface SortSearchParams {
  search: string
  page: number
  descending: boolean
  perPage: number
  sortBy: string
}
