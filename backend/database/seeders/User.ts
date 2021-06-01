import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { UserFactory } from '../factories'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await UserFactory.with('companies', 1).createMany(1)
  }
}
