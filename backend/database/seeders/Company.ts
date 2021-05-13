import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import {
  CompanyFactory,
  /* UserFactory,
  CustomerFactory,
  UserProfileFactory,
  CustomerAddressFactory, */
} from '../factories'
//import Company from 'App/Models/Company'
//import Customer from 'App/Models/Customer'

export default class CompanySeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await CompanyFactory.with('users', 2, (user) => user.with('profile'))
      .with('users', 2, (user) => user.apply('fullAccess').with('profile'))
      .with('customers', 10, (customer) => {
        customer.with('addresses', 1, (address) => address.apply('shippingAddress'))
        customer.with('addresses', 1, (address) => address.apply('billingAddress'))
      })
      .createMany(3)

    // Alternative implementation of the same factory call above.

    /* let companies = await CompanyFactory.makeMany(3)
    companies = JSON.parse(JSON.stringify(companies))

    for await (const company of companies) {
      //console.log(company)
      let users = await UserFactory.makeMany(3)
      users = JSON.parse(JSON.stringify(users))
      //console.log(users)

      const persistedCompany = await Company.create(company)

      const persistedUsers = await persistedCompany.related('users').createMany(users)
      for await (const user of persistedUsers) {
        let profile = await UserProfileFactory.make()
        profile = JSON.parse(JSON.stringify(profile))
        await user.related('profile').create(profile)
      }

      let customers = await CustomerFactory.makeMany(3)
      customers = JSON.parse(JSON.stringify(customers))

      let persistedCustomers = await persistedCompany.related('customers').createMany(customers)

      for await (const customer of persistedCustomers) {
        let shippingAddress = await CustomerAddressFactory.apply('shippingAddress').make()
        shippingAddress = JSON.parse(JSON.stringify(shippingAddress))
        let billingAddress = await CustomerAddressFactory.apply('billingAddress').make()
        billingAddress = JSON.parse(JSON.stringify(billingAddress))
        await customer.related('addresses').createMany([shippingAddress, billingAddress])
      }
    }*/
  }
}
