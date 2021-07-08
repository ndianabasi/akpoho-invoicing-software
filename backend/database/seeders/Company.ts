import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { CompanyFactory } from '../factories'

export default class CompanySeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await CompanyFactory.with('users', 2, (user) => user.apply('companyAdmin').with('profile')) // Two CompanyAdmin users with full access to backend
      .with('users', 4, (user) => user.apply('companyEditor').with('profile')) // Four CompanyEditor users with full access to backend
      .with('users', 6, (user) => user.apply('companyStaff').with('profile')) // Six CompanyStaff users with full access to backend
      .with('customers', 10, (customer) => {
        customer.with('addresses', 1, (address) => address.apply('shippingAddress'))
        customer.with('addresses', 1, (address) => address.apply('billingAddress'))
      })
      .with('products', 30)
      .createMany(6)
  }
}
