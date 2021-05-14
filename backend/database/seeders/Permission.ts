import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { permissions } from '../data/permissions'
import Permission from 'App/Models/Permission'

export default class PermissionSeeder extends BaseSeeder {
  public async run() {
    for (let index = 0; index < permissions.length; index++) {
      const permission = permissions[index]

      await Permission.firstOrCreate({ name: permission })
    }
  }
}
