/**
 * Config source: https://git.io/JvgAf
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import { MailConfig } from '@ioc:Adonis/Addons/Mail'

const mailConfig: MailConfig = {
  /*
  |--------------------------------------------------------------------------
  | Default mailer
  |--------------------------------------------------------------------------
  |
  | The following mailer will be used to send emails, when you don't specify
  | a mailer
  |
  */
  mailer: Env.get('DEMO_MODE') === true ? 'mailHog' : Env.get('MAILER'),

  /*
  |--------------------------------------------------------------------------
  | Mailers
  |--------------------------------------------------------------------------
  |
  | You can define or more mailers to send emails from your application. A
  | single `driver` can be used to define multiple mailers with different
  | config.
  |
  | For example: Postmark driver can be used to have different mailers for
  | sending transactional and promotional emails
  |
  */
  mailers: {
    /*
    |--------------------------------------------------------------------------
    | Smtp
    |--------------------------------------------------------------------------
    |
    | Uses SMTP protocol for sending email
    |
    */
    smtp: {
      driver: 'smtp',
      host: Env.get('SMTP_HOST') || 'localhost',
      port: Env.get('SMTP_PORT') || 587,
      auth: {
        user: Env.get('SMTP_USERNAME') || '',
        pass: Env.get('SMTP_PASSWORD') || '',
        type: 'login',
      },
    },

    /*
    |--------------------------------------------------------------------------
    | Mailgun
    |--------------------------------------------------------------------------
    |
		| Uses Mailgun service for sending emails.
    |
    | If you are using an EU domain. Ensure to change the baseUrl to hit the
    | europe endpoint (https://api.eu.mailgun.net/v3).
    |
    */
    mailgun: {
      driver: 'mailgun',
      baseUrl: 'https://api.mailgun.net/v3',
      key: Env.get('MAILGUN_API_KEY') || '',
      domain: Env.get('MAILGUN_DOMAIN') || '',
    },

    /*
    |--------------------------------------------------------------------------
    | SparkPost
    |--------------------------------------------------------------------------
    |
		| Uses Sparkpost service for sending emails.
    |
    */
    sparkpost: {
      driver: 'sparkpost',
      baseUrl: 'https://api.sparkpost.com/api/v1',
      key: Env.get('SPARKPOST_API_KEY') || '',
    },
    /*
    |--------------------------------------------------------------------------
    | MailHog (for local testing/trapping)
    |--------------------------------------------------------------------------
    |
    | Uses SMTP protocol for sending email
    |
    */
    mailHog: {
      driver: 'smtp',
      host: Env.get('SMTP_HOST') || 'localhost',
      port: Env.get('SMTP_PORT') || 1025,
      secure: false,
    },

    /*
    |--------------------------------------------------------------------------
    | Mailjet
    |--------------------------------------------------------------------------
    |
		| Uses Mailjet service for sending emails.
    |
    */
    /* mailjet: {
      driver: 'mailjet',
      auth: {
        publicKey: Env.get('MAILJET_API_KEY'),
        secretKey: Env.get('MAILJET_SECRET_KEY'),
      },
    }, */
  },
}

export default mailConfig
