import Factory from '@ioc:Adonis/Lucid/Factory'
import Company, { CompanyType } from 'App/Models/Company'
import slugify from 'slugify'
import CustomerFactory from './CustomerFactory'
import ProductFactory from './ProductFactory'
import UserFactory from './UserFactory'

const CompanyFactory = Factory.define(Company, ({ faker }) => {
  const companyName = faker.company.companyName()
  const generatedCompany = {
    email: faker.internet.email(),
    name: companyName,
    phone_number: faker.phone.number(),
    address: faker.address.streetAddress(true),
    is_approved: faker.datatype.boolean(),
    city: faker.address.city(),
    state: null,
    country: null,
    slug: slugify(companyName, { lower: true, strict: true }),
    type: faker.helpers.arrayElement(['personal', 'corporate']) as CompanyType,
    website: faker.internet.url(),
  }

  //console.log(generatedCompany)

  return generatedCompany
})
  .relation('users', () => UserFactory)
  .relation('customers', () => CustomerFactory)
  .relation('products', () => ProductFactory)
  .build()

export default CompanyFactory
