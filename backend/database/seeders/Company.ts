import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { CompanyFactory } from '../factories'

export default class CompanySeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await CompanyFactory.with('users', 3).createMany(3)
  }
}
