import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from 'App/Models/Customer'
import { CustomContextContract } from '../../Controllers/types/index'

export default class CustomersController {
  public async index({ response, requestedCompany, request, bouncer }: CustomContextContract) {
    await bouncer.with('CustomerPolicy').authorize('list', requestedCompany!)

    const { search, page, descending, perPage, sortBy } = request.qs()
    //console.log(search, page, descending, perPage, sortBy)

    let subquery = Customer.query()
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
      .where({ company_id: requestedCompany?.id })

    if (sortBy) {
      subquery = subquery.orderBy(sortBy, descending === 'true' ? 'desc' : 'asc')
    }

    let customers
    if (page && perPage) {
      customers = await subquery.paginate(page, perPage)
    } else {
      customers = await subquery
    }

    return response.ok({ data: customers })
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({
    response,
    requestedCompany,
    requestedCustomer,
    bouncer,
  }: CustomContextContract) {
    await bouncer.with('CustomerPolicy').authorize('delete', requestedCompany!, requestedCustomer!)

    await requestedCustomer?.delete()

    return response.ok({
      message: 'Customer was deleted successfully.',
      data: requestedCustomer?.id,
    })
  }
}
