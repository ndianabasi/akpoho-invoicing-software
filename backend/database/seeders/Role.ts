import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { roles } from '../data/roles'
import Role from 'App/Models/Role'

export default class RoleSeeder extends BaseSeeder {
  public async run() {
    for (let index = 0; index < roles.length; index++) {
      const roleData = roles[index]

      const role = await Role.findBy('name', roleData.name)
      if (!role) await Role.create(roleData)
    }
  }
}
