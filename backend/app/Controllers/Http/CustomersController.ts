import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from 'App/Models/Customer'
import CustomerTitle from 'App/Models/CustomerTitle'

export default class CustomersController {
  public async index({ response, requestedCompany, request, bouncer }: HttpContextContract) {
    await bouncer.with('CustomerPolicy').authorize('list', requestedCompany!)

    const {
      page,
      descending,
      perPage,
      sortBy,
      id,
      first_name,
      last_name,
      email,
      phone_number,
      is_corporate,
      created_at,
      updated_at,
    } = request.qs()
    //console.log(search, page, descending, perPage, sortBy)

    const searchQuery = {
      id: id ? id : null,
      first_name: first_name ? first_name : null,
      last_name: last_name ? last_name : null,
      email: email ? email : null,
      phone_number: phone_number ? phone_number : null,
      is_corporate: is_corporate ? is_corporate : null,
      created_at: created_at ? created_at : null,
      updated_at: updated_at ? updated_at : null,
    }

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
        'company_email'
      )
      .where({ company_id: requestedCompany?.id })

    if (sortBy) {
      subquery = subquery.orderBy(sortBy, descending === 'true' ? 'desc' : 'asc')
    }

    if (searchQuery) {
      subquery.where((query) => {
        for (const param in searchQuery) {
          if (Object.prototype.hasOwnProperty.call(searchQuery, param)) {
            let value = searchQuery[param]
            if (value) {
              if (value === 'true') value = true
              if (value === 'false') value = false

              //console.log(param, value)
              query.where(param, value)
              if (typeof value === 'string') {
                query.orWhere(param, 'like', `%${value}%`)
              }
            }
          }
        }
      })
    }

    const customers = await subquery.paginate(page ? page : 1, perPage ? perPage : 20)

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
  }: HttpContextContract) {
    await bouncer.with('CustomerPolicy').authorize('delete', requestedCompany!, requestedCustomer!)

    await requestedCustomer?.delete()

    return response.ok({
      message: 'Customer was deleted successfully.',
      data: requestedCustomer?.id,
    })
  }

  public async customerTitlesForSelect({ response, isGlobalUser, authRole }: HttpContextContract) {
    const titles = await CustomerTitle.query()
      .orderBy('name', 'asc')
      .select(...['id', 'name'])

    const transformedTitles = titles.map((role) => {
      return {
        label: role.name,
        value: role.id,
      }
    })

    return response.ok({
      data: transformedTitles,
    })
  }
}
