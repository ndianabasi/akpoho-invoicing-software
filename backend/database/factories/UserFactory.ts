import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'

const UserFactory = Factory.define(User, ({ faker }) => {
  const generatedUser = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  }

  return generatedUser
}).build()

export default UserFactory
