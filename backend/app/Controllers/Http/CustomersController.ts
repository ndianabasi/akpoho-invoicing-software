import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from 'App/Models/Customer'
import { CustomContextContract } from '../../Controllers/types/index'

export default class CustomersController {
  public async index({ response, requestedCompany }: CustomContextContract) {
    const customers = await Customer.query()
      .where({ company_id: requestedCompany?.id })
      .select(
        'id',
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'is_corporate',
        'created_at',
        'updated_at',
        'corporate_has_rep',
        'company_name',
        'company_email',
        'company_street_address',
        'company_postal_code',
        'company_city'
      )
    /* customers
        .with('companyCountry', (query) => query.select('name'))
        .with('companyState', (query) => query.select('name')) */

    return response.ok({ data: customers })
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
