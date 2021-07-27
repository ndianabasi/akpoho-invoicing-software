/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  DB_CONNECTION: Env.schema.string(),

  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  APP_SENDING_EMAIL: Env.schema.string(),
  CACHE_VIEWS: Env.schema.boolean(),
  SESSION_DRIVER: Env.schema.string(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'testing'] as const),
  DEMO_MODE: Env.schema.boolean({ message: 'DEMO_TRUE variable should be a boolean' }),

  MYSQL_HOST: Env.schema.string({ format: 'host' }),
  MYSQL_PORT: Env.schema.number(),
  MYSQL_USER: Env.schema.string(),
  MYSQL_PASSWORD: Env.schema.string.optional(),
  MYSQL_DB_NAME: Env.schema.string(),

  REDIS_CONNECTION: Env.schema.enum(['local'] as const),
  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),

  // Customer variables
  UUID_NAMESPACE: Env.schema.string(),
  APP_URL: Env.schema.string({ format: 'url' }),
  FRONTEND_URL: Env.schema.string({ format: 'url' }),

  // SMTP driver
  SMTP_HOST: Env.schema.string({ format: 'host' }),
  SMTP_PORT: Env.schema.number(),
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.string(),

  // Mailgun driver
  MAILGUN_API_KEY: Env.schema.string(),
  MAILGUN_DOMAIN: Env.schema.string(),

  // Sparkpost
  SPARKPOST_API_KEY: Env.schema.string(),

  // Mailjet
  MAILJET_API_KEY: Env.schema.string(),
  MAILJET_SECRET_KEY: Env.schema.string(),

  // Print Server
  PROD_PRINT_SERVER_HOST: Env.schema.string({ format: 'host' }),
  PROD_PRINT_SERVER_PORT: Env.schema.number(),
  DEV_PRINT_SERVER_HOST: Env.schema.string({ format: 'host' }),
  DEV_PRINT_SERVER_PORT: Env.schema.number(),
})
