import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'
import CompanyFactory from './CompanyFactory'
import UserProfileFactory from './UserProfileFactory'

const UserFactory = Factory.define(User, ({ faker }) => {
  const generatedUser = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    login_status: faker.datatype.boolean(),
    is_account_activated: faker.datatype.boolean(),
    is_email_verified: faker.datatype.boolean(),
  }

  //console.log(generatedUser)

  return generatedUser
})
  .relation('companies', () => CompanyFactory)
  .relation('profile', () => UserProfileFactory)
  .build()

export default UserFactory
