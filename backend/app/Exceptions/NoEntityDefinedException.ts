import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new NoEntityDefinedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class NoEntityDefinedException extends Exception {
  constructor(message: string, code = 'E_NO_ENTITY_DEFINED', status = 400) {
    super(message, status, code)
    this.message = message
    this.code = code
    this.status = status
  }

  public async handle(_error: this, ctx: HttpContextContract) {
    return ctx.response.badRequest(this.message)
  }
}
