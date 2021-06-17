import { EventsList } from '@ioc:Adonis/Core/Event'
import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'
import geoip from 'geoip-country'
import Database from '@ioc:Adonis/Lucid/Database'
import { CACHE_TAGS } from 'Contracts/cache'
import CacheHelper from 'App/Helpers/CacheHelper'
import AccountVerificationEmail from 'App/Mailers/AccountVerificationEmail'
import Encryption from '@ioc:Adonis/Core/Encryption'

const env = Env.get('NODE_ENV')
const isProductionEnv = env === 'production'
const isTestingEnv = env === 'testing'

export default class Auth {
  public async onSendCode({ user, type }: EventsList['auth::send-code']) {
    if (user) {
      if (type === 'password_change_code') {
        await user.load('passwordChange')
        const passwordChange = user?.passwordChange

        if (env === 'development' || env === 'testing') {
          Logger.info(
            'Use this code: %d\nCode expires at: %s',
            passwordChange?.verificationCode ?? null,
            passwordChange?.verificationCodeExpiresAt?.toISO() ?? null
          )
        }

        //await Cache.tags([`user=${user.id}`]).flush()

        if (env === 'production') {
          // Implement email sending
        } else Logger.info('Password change verification code has been sent.')
      }
    } else Logger.warn('Warning from Auth.onSendCode: User not defined')
  }

  public async onSendSuccessEmails({ user, type }: EventsList['auth::send-success-emails']) {
    if (user) {
      if (type === 'password_change_success') {
        if (env === 'production') {
          // Implement email sending
        } else Logger.info('Password change was successful.')
      }
    } else Logger.warn('Warning from Auth.onSendSuccessEmails: User not defined')
  }

  public async onNewLogin({ user, ip }: EventsList['auth::new-login']) {
    try {
      if (user) {
        // Persist login record to DB
        const countryObject = geoip.lookup(ip)
        let country
        if (countryObject !== null) {
          country = countryObject.country
        }

        await user
          .related('loginRecords')
          .create({ ipAddress: ip, location: country || 'localhost' })

        // Persist last_login_time and lifetime_login to users table
        // Clean up login code information
        let lifetime_login = user?.lifetimeLogin ?? 0

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
          `${CACHE_TAGS.USER_CACHE_TAG_PREFIX}:${user.id}`,
          `${CACHE_TAGS.COMPANY_USERS_CACHE_TAG_PREFIX}:${user.id}`,
          `${CACHE_TAGS.COMPANY_USERS_INDEX_CACHE_TAG_PREFIX}:${user.id}`,
        ]
        await CacheHelper.flushTags(sets)
      } else Logger.warn('Warning from Auth.onNewLogin: User not defined')
    } catch (error) {
      Logger.error('Error from onNewLogin:\n%o', error)
    }
  }

  public async onNewRegistrationVerification({
    user,
  }: EventsList['auth::new-registration-verification']) {
    // Step 1: generate encrypted string to be used for email
    // This is not meant for storing in var(255) column as
    // it is over 255 characters. 282 characters, actually
    // Storing as text is not an option too due to indexing cost
    // Best bet is to make this stateless
    // So encrypted key will be embed in URL is sent via email without storing
    const key = Encryption.encrypt(`email-verification-for-${user.id}`, '2 days', undefined)

    const EMAIL_VERIFICATION_URI = Env.get('EMAIL_VERIFICATION_URI', 'auth/verify-email')
    const FRONTEND_URL = Env.get('FRONTEND_URL')
    const emailVerificationLink = `${FRONTEND_URL}${EMAIL_VERIFICATION_URI}/${key}`

    if (isProductionEnv || isTestingEnv) {
      await new AccountVerificationEmail(user, emailVerificationLink).sendLater()
    } else {
      // Log verification URL to console
      Logger.info(
        '\n\n==============\nUse this link to verify your email address:\n%s\n==============',
        emailVerificationLink
      )
    }
  }
}
