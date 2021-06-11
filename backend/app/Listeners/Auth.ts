import { EventsList } from '@ioc:Adonis/Core/Event'
import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'
import geoip from 'geoip-country'
import Database from '@ioc:Adonis/Lucid/Database'
import { CACHE_TAGS } from 'Contracts/cache'
import CacheHelper from 'App/Helpers/CacheHelper'

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

  public async onNewLogin({ user, ip }: EventsList['auth::new-login']) {
    // Persist login record to DB
    const countryObject = geoip.lookup(ip)
    let country
    if (countryObject !== null) {
      country = countryObject.country
    }

    await user.related('loginRecords').create({ ipAddress: ip, location: country || 'localhost' })

    // Persist last_login_time and lifetime_login to users table
    // Clean up login code information
    let lifetime_login = user.lifetimeLogin

    // Avoid updating the timestamps on the user's record
    // due to this minor changes by using the Database class
    await Database.from('users')
      .where('id', user.id)
      .update({
        lifetime_login: ++lifetime_login,
        login_code: null,
        login_code_expires_at: null,
      })

    // Clear the user's entire cache
    const sets = [
      `${CACHE_TAGS.USER_CACHE_TAG_PREFIX}:${user?.id}`,
      `${CACHE_TAGS.COMPANY_USERS_CACHE_TAG_PREFIX}:${user?.id}`,
      `${CACHE_TAGS.COMPANY_USERS_INDEX_CACHE_TAG_PREFIX}:${user?.id}`,
    ]
    await CacheHelper.flushTags(sets)
  }
}
