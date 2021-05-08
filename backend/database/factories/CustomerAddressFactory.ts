import Factory from '@ioc:Adonis/Lucid/Factory'
import CustomerAddress from 'App/Models/CustomerAddress'

const CustomerAddressFactory = Factory.define(CustomerAddress, ({ faker }) => {
  const generatedAddress = {
    street_address: faker.address.streetAddress(true),
    city: faker.address.city(),
    postal_code: faker.address.zipCode(),
    address_type: faker.random.arrayElement(['billing_address', 'shipping_address']),
  }

  //console.log(generatedAddress)

  return generatedAddress
})
  .state('billingAddress', (address) => (address.addressType = 'billing_address'))
  .state('shippingAddress', (address) => (address.addressType = 'shipping_address'))
  .build()

export default CustomerAddressFactory
