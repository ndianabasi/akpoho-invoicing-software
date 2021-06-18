import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import companySizes from '../data/company_sizes'
import CompanySize from 'App/Models/CompanySize'

export default class CompanySizeSeeder extends BaseSeeder {
  public async run() {
    for (let index = 0; index < companySizes.length; index++) {
      const size = companySizes[index]

      await CompanySize.firstOrCreate({ size })
    }
  }
}
