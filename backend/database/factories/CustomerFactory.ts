import Factory from '@ioc:Adonis/Lucid/Factory'
import Customer from 'App/Models/Customer'
import CustomerAddressFactory from './CustomerAddressFactory'

const CustomerFactory = Factory.define(Customer, ({ faker }) => {
  const isCorporate = faker.datatype.boolean()
  const generatedCustomer = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber(),
    //address: faker.address.streetAddress(true),
  }

  const corporateCustomer = {
    corporate_has_rep: faker.datatype.boolean(),
    company_name: faker.company.companyName(),
    company_email: faker.internet.email(),
    company_street_address: faker.address.streetAddress(true),
    company_city: faker.address.city(),
    company_postal_code: faker.address.zipCode(),
  }

  const customer = isCorporate ? { ...generatedCustomer, ...corporateCustomer } : generatedCustomer

  //console.log(customer)

  return customer
})
  .relation('addresses', () => CustomerAddressFactory)
  .build()

export default CustomerFactory
