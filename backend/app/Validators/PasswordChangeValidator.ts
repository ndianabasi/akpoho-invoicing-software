import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PasswordChangeValidator {
  constructor(protected ctx: HttpContextContract) {}

  private passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
  public refs = schema.refs({ newPassword: this.ctx.request.body().newPassword })

  public schema = schema.create({
    newPassword: schema.string({ escape: true, trim: true }, [rules.regex(this.passwordRegex)]),

    confirmNewPassword: schema.string({ escape: true, trim: true }, [
      rules.equalTo(this.refs.newPassword),
    ]),

    secret: schema.string({ trim: true, escape: true }, [
      rules.uuid({ version: 5 }),
      rules.required(),
    ]),
  })

  public messages = {
    'newPassword.required': 'New Password is required!',
    'confirmNewPassword.required': 'Confirm Password is required!',
    'confirmNewPassword.equalTo': 'Both passwords should be the same.',
    'secret.uuid': 'Secret is invalid',
    'secret.required': 'Secret is required',
  }
}
