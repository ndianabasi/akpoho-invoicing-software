import Factory from '@ioc:Adonis/Lucid/Factory'
import { ADDRESS_TYPES } from 'App/Helpers/utils'
import Country from 'App/Models/Country'
import CustomerAddress from 'App/Models/CustomerAddress'
import State from 'App/Models/State'

const CustomerAddressFactory = Factory.define(CustomerAddress, async ({ faker }) => {
  // Get array of country ids
  const countryIds = (await Country.all()).map((country) => country.id)
  const country = faker.random.arrayElement(countryIds)
  // Get states in the country
  const stateIds = (await State.query().where('country_id', country)).map((state) => state.id)
  const state = stateIds.length > 0 ? faker.random.arrayElement(stateIds) : null

  const generatedAddress = {
    street_address: faker.address.streetAddress(true),
    city: faker.address.city(),
    postal_code: faker.address.zipCode(),
    address_type: faker.random.arrayElement(ADDRESS_TYPES),
    stateId: state,
    countryId: country,
  }

  //console.log(generatedAddress)

  return generatedAddress
})
  .state('billingAddress', (address) => (address.addressType = 'billing_address'))
  .state('shippingAddress', (address) => (address.addressType = 'shipping_address'))
  .build()

export default CustomerAddressFactory
