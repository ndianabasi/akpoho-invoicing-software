import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { UserFactory } from '../factories/index'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const user = await UserFactory.create()
  }
}
