import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import CustomerAddress from 'App/Models/CustomerAddress'
import CustomerAddressValidator from 'App/Validators/CustomerAddressValidator'
import { ADDRESS_TYPE } from 'types/customer'

export default class CustomerAddressesController {
  public async index({}: HttpContextContract) {}

  public async showAddresses({
    response,
    requestedCompany,
    requestedCustomer,
    bouncer,
  }: HttpContextContract) {
    await bouncer.with('CustomerPolicy').authorize('view', requestedCompany!, requestedCustomer!)

    const addresses = await Database.from('customer_addresses')
      .select(
        'customer_addresses.address_type',
        'customer_addresses.city',
        'customer_addresses.created_at',
        'customer_addresses.id',
        'customer_addresses.postal_code',
        'customer_addresses.street_address',
        'customer_addresses.updated_at',
        'countries.name as country',
        'states.name as state'
      )
      .leftJoin('countries', (query) => {
        query.on('countries.id', '=', 'customer_addresses.country_id')
      })
      .leftJoin('states', (query) => {
        query.on('states.id', '=', 'customer_addresses.state_id')
      })
      .where('customer_addresses.customer_id', requestedCustomer?.id!)

    return response.ok({ data: addresses })
  }

  public async show({
    response,
    requestedCompany,
    requestedCustomer,
    requestedCustomerAddress,
    bouncer,
  }: HttpContextContract) {
    await bouncer.with('CustomerPolicy').authorize('view', requestedCompany!, requestedCustomer!)

    await requestedCustomerAddress?.load('addressCountry', (countryQuery) =>
      countryQuery.select('id', 'name')
    )
    await requestedCustomerAddress?.load('addressState', (stateQuery) =>
      stateQuery.select('id', 'name')
    )

    return response.ok({ data: requestedCustomerAddress })
  }

  public async destroy({
    response,
    requestedCompany,
    requestedCustomer,
    requestedCustomerAddress,
    bouncer,
  }: HttpContextContract) {
    await bouncer.with('CustomerPolicy').authorize('delete', requestedCompany!, requestedCustomer!)

    await requestedCustomerAddress?.delete()

    return response.ok({
      message: 'Customer address was deleted successfully.',
      data: requestedCustomerAddress?.id,
    })
  }

  public async update({
    response,
    requestedCompany,
    requestedCustomer,
    requestedCustomerAddress,
    bouncer,
    request,
  }: HttpContextContract) {
    const { address, lga, postal_code, state, country, type } = await request.validate(
      CustomerAddressValidator
    )

    await bouncer.with('CustomerPolicy').authorize('edit', requestedCompany!, requestedCustomer!)

    requestedCustomerAddress?.merge({
      addressType: type as ADDRESS_TYPE,
      streetAddress: address,
      city: lga,
      countryId: country,
      stateId: state,
      postalCode: postal_code,
    })
    await requestedCustomerAddress?.save()

    return response.ok({ data: requestedCustomerAddress?.id })
  }

  public async store({
    response,
    requestedCompany,
    requestedCustomer,
    bouncer,
    request,
  }: HttpContextContract) {
    const { address, lga, postal_code, state, country, type } = await request.validate(
      CustomerAddressValidator
    )

    // This is part of the editing operation for the customer
    await bouncer.with('CustomerPolicy').authorize('edit', requestedCompany!, requestedCustomer!)

    if (type === 'both') {
      const addressTypes: Array<ADDRESS_TYPE> = ['shipping_address', 'billing_address']
      for (let i = 0; i < addressTypes.length; i++) {
        const addressType = addressTypes[i]

        await requestedCustomer?.related('addresses').create({
          addressType,
          streetAddress: address,
          city: lga,
          countryId: country,
          stateId: state,
          postalCode: postal_code,
        })
      }
    } else {
      await requestedCustomer?.related('addresses').create({
        addressType: type as ADDRESS_TYPE,
        streetAddress: address,
        city: lga,
        countryId: country,
        stateId: state,
        postalCode: postal_code,
      })
    }

    return response.created()
  }

  public async customerAddressesForSelect({
    response,
    requestedCompany,
    requestedCustomer,
    bouncer,
    request,
  }: HttpContextContract) {
    await bouncer
      .with('CustomerPolicy')
      .authorize('view', requestedCompany ?? null, requestedCustomer!)

    if (requestedCustomer) {
      const { type } = request.qs()

      const addresses = await requestedCustomer
        ?.related('addresses')
        .query()
        .select(
          'customer_addresses.city',
          'customer_addresses.created_at',
          'customer_addresses.id',
          'customer_addresses.postal_code',
          'customer_addresses.street_address',
          'countries.name as country',
          'states.name as state',
          'customer_addresses.address_type'
        )
        .if(type && type !== 'both', (query) =>
          query.where('customer_addresses.address_type', type)
        )
        .leftJoin('countries', (query) => {
          query.on('countries.id', '=', 'customer_addresses.country_id')
        })
        .leftJoin('states', (query) => {
          query.on('states.id', '=', 'customer_addresses.state_id')
        })

      const getAddressesByType = function (addresses: CustomerAddress[], type: ADDRESS_TYPE) {
        const transformedSearchedAddresses = addresses
          .map((rawAddress) => rawAddress.serialize())
          .filter((serialisedAddress) => serialisedAddress.address_type === type)
          .map((serialisedAddress) => {
            const fullName = `${serialisedAddress.street_address}${
              serialisedAddress.city ? ', ' + serialisedAddress.city : ''
            }${serialisedAddress.state ? ', ' + serialisedAddress.state : ''}${
              serialisedAddress.country ? ', ' + serialisedAddress.country : ''
            }`

            return {
              label: fullName,
              value: serialisedAddress.id,
            }
          })

        return transformedSearchedAddresses
      }

      return response.ok({
        data: {
          shippingAddresses: getAddressesByType(addresses, 'shipping_address'),
          billingAddresses: getAddressesByType(addresses, 'billing_address'),
        },
      })
    } else {
      return response.abort({ message: 'Invalid request made' })
    }
  }
}
