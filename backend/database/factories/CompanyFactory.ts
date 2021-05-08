import Factory from '@ioc:Adonis/Lucid/Factory'
import Company from 'App/Models/Company'
import slugify from 'slugify'
import CustomerFactory from './CustomerFactory'
import UserFactory from './UserFactory'

const CompanyFactory = Factory.define(Company, ({ faker }) => {
  const companyName = faker.company.companyName()
  const generatedCompany = {
    email: faker.internet.email(),
    name: companyName,
    phone_number: faker.phone.phoneNumber(),
    address: faker.address.streetAddress(true),
    is_approved: faker.datatype.boolean(),
    city: faker.address.city(),
    state: null,
    country: null,
    slug: slugify(companyName, { lower: true, strict: true }),
  }

  //console.log(generatedCompany)

  return generatedCompany
})
  .relation('users', () => UserFactory)
  .relation('customers', () => CustomerFactory)
  .build()

export default CompanyFactory
