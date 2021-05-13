import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Company from 'App/Models/Company'

export interface CustomContextContract extends HttpContextContract {
  requestedCompany?: Company
}
