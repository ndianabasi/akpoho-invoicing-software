import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import customerTitles from '../data/customer_titles'
import CustomerTitle from 'App/Models/CustomerTitle'

export default class PermissionSeeder extends BaseSeeder {
  public async run() {
    for (let index = 0; index < customerTitles.length; index++) {
      const title = customerTitles[index]

      await CustomerTitle.firstOrCreate({ name: title })
    }
  }
}
