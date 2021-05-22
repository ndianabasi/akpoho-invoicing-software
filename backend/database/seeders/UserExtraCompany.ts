import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Company from 'App/Models/Company'
import User from 'App/Models/User'
import faker from 'faker'

type IDObject = { id: string }

interface IdArray extends Array<IDObject> {
  [index: number]: IDObject
}

export default class UserExtraCompanySeeder extends BaseSeeder {
  public async run() {
    const allUsers = await User.query().preload('companies', (companiesQuery) =>
      companiesQuery.select('id')
    )

    const allCompanies = await Company.query().select('id')
    const allCompaniesIDs: IdArray = JSON.parse(JSON.stringify(allCompanies))
    const flattenedCompaniesIDs = allCompaniesIDs.map((company) => company.id)

    for (let index = 0; index < allUsers.length; index++) {
      const user = allUsers[index]
      //console.log(user.companies.map((company) => company.id))

      const twoRandomCompanies = faker.random.arrayElements(
        flattenedCompaniesIDs.filter((company) =>
          user.companies.some((userCompany) => userCompany.id !== company)
        ),
        2
      )
      //console.log(twoRandomCompanies)

      await user.related('companies').attach(twoRandomCompanies)
    }
  }
}
