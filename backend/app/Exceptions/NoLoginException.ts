import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@poppinss/utils'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new NoLoginException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class NoLoginException extends Exception {
  public code = 'E_AUTHENTICATION_FAILURE'
  public status = 403

  constructor({ message, status, code }: { message: string; status?: number; code?: string }) {
    super(message, status, code)
    this.message = message
    this.code = code ? code : this.code
    this.status = status ? status : this.status
  }

  public async handle(_error: this, ctx: HttpContextContract) {
    return ctx.response.status(401).send(this.message)
  }
}
