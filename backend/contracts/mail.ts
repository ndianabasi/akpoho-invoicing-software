/**
 * Contract source: https://git.io/JvgAT
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

declare module '@ioc:Adonis/Addons/Mail' {
  import { MailDrivers } from '@ioc:Adonis/Addons/Mail'

  // eslint-disable-next-line no-unused-vars
  interface MailersList {
    smtp: MailDrivers['smtp']
    mailgun: MailDrivers['mailgun']
    sparkpost: MailDrivers['sparkpost']
  }
}
