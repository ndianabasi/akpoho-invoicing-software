import Factory from '@ioc:Adonis/Lucid/Factory'
import Customer from 'App/Models/Customer'
import CustomerAddressFactory from './CustomerAddressFactory'

const CustomerFactory = Factory.define(Customer, ({ faker }) => {
  const isCorporate = faker.datatype.boolean()
  const companyHasRep = faker.datatype.boolean()
  const generatedCustomer = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber(),
    //address: faker.address.streetAddress(true),
  }

  const corporateCustomer = {
    companyName: faker.company.companyName(),
    companyEmail: faker.internet.email(),
    companyPhone: faker.phone.phoneNumber(),
  }

  const customer =
    isCorporate && companyHasRep
      ? { ...generatedCustomer, ...corporateCustomer }
      : isCorporate && !companyHasRep
      ? { ...corporateCustomer }
      : generatedCustomer

  //console.log(customer)

  return customer
})
  .relation('addresses', () => CustomerAddressFactory)
  .build()

export default CustomerFactory
