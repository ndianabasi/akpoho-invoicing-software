import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import { commonEmailProperties } from 'App/Helpers/utils'

export default class AccountVerificationEmail extends BaseMailer {
  constructor(private newUser: User, private emailVerificationLink: string) {
    super()
  }

  public async prepare(message: MessageContract) {
    const { APP_NAME, APP_SENDING_EMAIL } = commonEmailProperties()

    await this.newUser.load('profile')
    const profile = this.newUser.profile

    // Send email to new user
    message
      .subject('Akpoho Software! Please Confirm Your Email Address')
      .from(APP_SENDING_EMAIL, APP_NAME)
      .to(this.newUser.email, this.newUser.profile.fullName)
      .htmlView('emails/new-account-verification', {
        firstName: profile.firstName,
        email: this.newUser.email,
        link: this.emailVerificationLink,
      })

    // TO-DO: Implement sending notification email to SuperAdmin
  }
}
