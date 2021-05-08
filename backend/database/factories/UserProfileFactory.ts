import Factory from '@ioc:Adonis/Lucid/Factory'
import UserProfile from 'App/Models/UserProfile'

const UserProfileFactory = Factory.define(UserProfile, ({ faker }) => {
  const generatedProfile = {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    phone_number: faker.phone.phoneNumber(),
    address: faker.address.streetAddress(true),
    city: faker.address.city(),
    profile_picture: faker.image.avatar(),
  }

  //console.log(generatedProfile)

  return generatedProfile
}).build()

export default UserProfileFactory
