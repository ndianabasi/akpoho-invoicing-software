import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Customer from 'App/Models/Customer'
import CustomerTitle from 'App/Models/CustomerTitle'
import CustomerValidator from 'App/Validators/CustomerValidator'
import { ADDRESS_TYPE } from 'types/customer'

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
      company_name,
      company_email,
      company_phone,
    } = request.qs()

    const searchQuery = {
      id: id ? id : null,
      first_name: first_name ? first_name : null,
      last_name: last_name ? last_name : null,
      email: email ? email : null,
      phone_number: phone_number ? phone_number : null,
      is_corporate: is_corporate ? is_corporate : null,
      created_at: created_at ? created_at : null,
      updated_at: updated_at ? updated_at : null,
      company_name: company_name ? company_name : null,
      company_email: company_email ? company_email : null,
      company_phone: company_phone ? company_phone : null,
    }

    let subquery = Customer.query()
      .select(
        'customers.id',
        'customers.first_name',
        'customers.last_name',
        'customers.email',
        'customers.phone_number',
        'customers.created_at',
        'customers.updated_at',
        'customers.is_corporate',
        'customers.corporate_has_rep',
        'customers.company_name',
        'customers.company_email',
        'customers.company_phone',
        'customer_titles.name as title'
      )
      .select(
        Database.rawQuery('COALESCE(customers.company_email, customers.email) AS customer_email')
      )
      .select(
        Database.rawQuery(
          'COALESCE(customers.company_phone, customers.phone_number) AS customer_phone'
        )
      )
      .select(
        Database.rawQuery(
          "COALESCE(customers.company_name, CONCAT(customers.first_name, ' ', customers.last_name)) AS customer_name"
        )
      )
      .where({ company_id: requestedCompany?.id })
      .leftJoin('customer_titles', (query) =>
        query.on('customer_titles.id', '=', 'customers.customer_title_id')
      )

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

              if (param === 'title') {
                query.where('customer_titles.title', value)
              } else {
                query.where(`customers.${param}`, value)
                if (typeof value === 'string') {
                  query.orWhere(`customers.${param}`, 'like', `%${value}%`)
                }
              }
            }
          }
        }
      })
    }

    const customers = await subquery.paginate(page ? page : 1, perPage ? perPage : 20)

    return response.ok({ data: customers })
  }

  public async customersForSelect({
    response,
    requestedCompany,
    request,
    bouncer,
  }: HttpContextContract) {
    await bouncer.with('CustomerPolicy').authorize('list', requestedCompany!)

    const { query } = request.qs()

    const searchedCustomers = await Customer.query()
      .select(
        'customers.id',
        'customers.first_name',
        'customers.last_name',
        'customers.company_name',
        'customers.is_corporate',
        'customers.corporate_has_rep'
      )
      .where({ company_id: requestedCompany?.id })
      .where(function (whereQuery) {
        /**
         * We will use both fulltext search matching and pattern matching
         * to return the best results. If complete names are supplied,
         * fulltext search will be used. Else pattern matching will
         * return a result.
         */
        whereQuery
          .whereRaw(`customers.first_name LIKE '%${query}%'`)
          .orWhereRaw(`customers.middle_name LIKE '%${query}%'`)
          .orWhereRaw(`customers.last_name LIKE '%${query}%'`)
          .orWhereRaw(`customers.company_name LIKE '%${query}%'`)
      })
      .orderBy('customers.first_name', 'asc')

    const transformedSearchedCustomers = searchedCustomers.map((customer) => {
      const serialisedCustomer = customer.serialize()
      const isCorporate = Boolean(serialisedCustomer.is_corporate)
      const fullName = `${serialisedCustomer.first_name} ${serialisedCustomer.last_name}`

      return {
        label: isCorporate ? serialisedCustomer.company_name : fullName,
        value: serialisedCustomer.id,
      }
    })

    return response.ok({ data: transformedSearchedCustomers })
  }

  public async store({ response, requestedCompany, request, bouncer }: HttpContextContract) {
    const {
      title,
      first_name,
      last_name,
      middle_name,
      email,
      phone_number,
      is_corporate,
      corporate_has_rep,
      company_name,
      company_phone,
      company_email,
      is_billing_shipping_addresses_same,
      billing_address,
      billing_country,
      billing_lga,
      billing_postal_code,
      billing_state,
      shipping_address,
      shipping_country,
      shipping_lga,
      shipping_postal_code,
      shipping_state,
    } = await request.validate(CustomerValidator)

    await bouncer.with('CustomerPolicy').authorize('create', requestedCompany!)

    const newCustomer = await requestedCompany?.related('customers').create({
      customerTitleId: title,
      firstName: first_name,
      lastName: last_name,
      middleName: middle_name,
      email,
      phoneNumber: phone_number,
      isCorporate: is_corporate,
      corporateHasRep: corporate_has_rep,
      companyName: company_name,
      companyPhone: company_phone,
      companyEmail: company_email,
    })

    if (is_billing_shipping_addresses_same) {
      const addressTypes: Array<ADDRESS_TYPE> = ['shipping_address', 'billing_address']
      for (let i = 0; i < addressTypes.length; i++) {
        const addressType = addressTypes[i]

        await newCustomer?.related('addresses').create({
          addressType,
          streetAddress: shipping_address,
          city: shipping_lga,
          countryId: shipping_country,
          stateId: shipping_state,
          postalCode: shipping_postal_code,
        })
      }
    } else {
      await newCustomer?.related('addresses').create({
        addressType: 'shipping_address',
        streetAddress: shipping_address,
        city: shipping_lga,
        countryId: shipping_country,
        stateId: shipping_state,
        postalCode: shipping_postal_code,
      })

      await newCustomer?.related('addresses').create({
        addressType: 'billing_address',
        streetAddress: billing_address,
        city: billing_lga,
        countryId: billing_country,
        stateId: billing_state,
        postalCode: billing_postal_code,
      })
    }

    return response.created({ data: newCustomer?.id })
  }

  public async show({
    response,
    requestedCompany,
    requestedCustomer,
    bouncer,
  }: HttpContextContract) {
    // Check authorisation
    await bouncer
      .with('CustomerPolicy')
      .authorize('view', requestedCompany ?? null, requestedCustomer!)

    await requestedCustomer?.load('title')

    return response.ok({ data: requestedCustomer })
  }

  public async update({
    response,
    requestedCompany,
    requestedCustomer,
    request,
    bouncer,
  }: HttpContextContract) {
    const {
      title,
      first_name,
      last_name,
      middle_name,
      email,
      phone_number,
      is_corporate,
      corporate_has_rep,
      company_name,
      company_phone,
      company_email,
    } = await request.validate(CustomerValidator)

    await bouncer.with('CustomerPolicy').authorize('edit', requestedCompany!, requestedCustomer!)

    requestedCustomer?.merge({
      customerTitleId: title,
      firstName: first_name,
      lastName: last_name,
      middleName: middle_name,
      email,
      phoneNumber: phone_number,
      isCorporate: is_corporate,
      corporateHasRep: corporate_has_rep,
      companyName: company_name,
      companyPhone: company_phone,
      companyEmail: company_email,
    })
    await requestedCustomer?.save()

    return response.created({ data: requestedCustomer?.id })
  }

  public async destroy({
    request,
    response,
    requestedCompany,
    requestedCustomer,
    bouncer,
  }: HttpContextContract) {
    /**
     * This method can be used to delete individual customers or multi-customers
     * For multiple customers, we need to check if the user is authorised to delete
     * all requested customers. If any check fails, the request will be aborted.
     */

    // Check if the body contains an array of requested customers
    const { customers } = request.body()
    if (customers && Array.isArray(customers)) {
      // This is a request to delete multiple customers
      await bouncer.with('CustomerPolicy').authorize('massDelete', customers)

      for (let i = 0; i < customers.length; i++) {
        const customerId = customers[i]
        let customer: Customer
        try {
          customer = await Customer.findOrFail(customerId)
          await customer.delete()
        } catch (error) {
          return response.abort({ message: 'Customer not found' })
        }
      }

      return response.ok({
        message: `${
          customers.length > 1 ? 'Customers were' : 'Customer was'
        } deleted successfully.`,
        data: customers,
      })
    } else {
      await bouncer
        .with('CustomerPolicy')
        .authorize('delete', requestedCompany!, requestedCustomer!)

      await requestedCustomer?.delete()

      return response.ok({
        message: 'Customer was deleted successfully.',
        data: requestedCustomer?.id,
      })
    }
  }

  public async customerTitlesForSelect({ response }: HttpContextContract) {
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
