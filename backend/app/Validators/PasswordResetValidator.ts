import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PasswordResetValidator {
  constructor(protected ctx: HttpContextContract) {}

  private passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
  public refs = schema.refs({ newPassword: this.ctx.request.body().newPassword })

  public schema = schema.create({
    newPassword: schema.string({ escape: true, trim: true }, [rules.regex(this.passwordRegex)]),

    confirmNewPassword: schema.string({ escape: true, trim: true }, [
      rules.equalTo(this.refs.newPassword),
    ]),

    email: schema.string({ escape: true, trim: true }, [rules.email()]),
  })

  public messages = {
    'newPassword.required': 'New Password is required.',
    'newPassword.regex': 'Please provide a strong password.',
    'confirmNewPassword.equalTo': 'Both passwords should be the same.',
    'confirmNewPassword.required': 'Confirm New Password is required.',
    'email.email': 'Email is not valid.',
  }
}
