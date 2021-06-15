import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import file_providers from '../data/file_providers'
import FileProvider from 'App/Models/FileProvider'

export default class FileProviderSeeder extends BaseSeeder {
  public async run() {
    for (let index = 0; index < file_providers.length; index++) {
      const provider = file_providers[index]

      await FileProvider.firstOrCreate({ name: provider })
    }
  }
}
