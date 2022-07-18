import Factory from '@ioc:Adonis/Lucid/Factory'
import Customer from 'App/Models/Customer'
import CustomerAddressFactory from './CustomerAddressFactory'

const CustomerFactory = Factory.define(Customer, ({ faker }) => {
  const isCorporate = faker.datatype.boolean()
  const corporateHasRep = faker.datatype.boolean()
  const generatedCustomer = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number(),
    //address: faker.address.streetAddress(true),
  }

  const corporateCustomer = {
    companyName: faker.company.companyName(),
    companyEmail: faker.internet.email(),
    companyPhone: faker.phone.number(),
  }

  const customer =
    isCorporate && corporateHasRep
      ? { ...generatedCustomer, ...corporateCustomer, isCorporate, corporateHasRep }
      : isCorporate && !corporateHasRep
      ? { ...corporateCustomer, isCorporate, corporateHasRep }
      : { ...generatedCustomer, isCorporate, corporateHasRep }

  //console.log(customer)

  return customer
})
  .relation('addresses', () => CustomerAddressFactory)
  .build()

export default CustomerFactory
