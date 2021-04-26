import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { UserFactory } from '../factories'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    //await UserFactory.createMany(3)

    await User.createMany([
      {
        email: 'ndianabasi.udonkang@gmail.com',
        password: 'wYG_t3MXWaFI12P',
      },
    ])
  }
}
