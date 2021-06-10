import { EventsList } from '@ioc:Adonis/Core/Event'
import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'

const env = Env.get('NODE_ENV')

export default class Auth {
  public async onSendCode({ user, type }: EventsList['auth::send-code']) {
    if (type === 'password_change_code') {
      await user.load('passwordChange')
      const passwordChange = user.passwordChange

      if (env === 'development' || env === 'testing') {
        Logger.info(
          'Use this code: %d\nCode expires at: %s',
          passwordChange?.verificationCode,
          passwordChange?.verificationCodeExpiresAt?.toISO()
        )
      }

      //await Cache.tags([`user=${user.id}`]).flush()

      if (env === 'production') {
        // Implement email sending
      } else Logger.info('Password change verification code has been sent.')
    }
  }

  public async onSendSuccessEmails({ user, type }: EventsList['auth::send-success-emails']) {
    if (type === 'password_change_success') {
      if (env === 'production') {
        // Implement email sending
      } else Logger.info('Password change was successful.')
    }
  }
}
