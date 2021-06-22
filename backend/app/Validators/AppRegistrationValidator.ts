import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { passwordRegex } from 'App/Helpers/utils'

export default class AppRegistrationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    newPassword: this.ctx.request.body().newPassword,
    countryId: this.ctx.request.body().countryId,
    stateId: this.ctx.request.body().stateId,
  })

  public schema = schema.create({
    email: schema.string({ escape: true, trim: true }, [
      rules.email(),
      rules.unique({
        column: 'email',
        table: 'users',
      }),
    ]),

    firstName: schema.string({ escape: true, trim: true }, [rules.maxLength(20)]),

    middleName: schema.string.optional({ escape: true, trim: true }, [rules.maxLength(20)]),

    lastName: schema.string({ escape: true, trim: true }, [rules.maxLength(20)]),

    newPassword: schema.string({ escape: true, trim: true }, [rules.regex(passwordRegex)]),

    confirmNewPassword: schema.string({ escape: true, trim: true }, [
      rules.equalTo(this.refs.newPassword),
    ]),

    phoneNumber: schema.string.optional({ escape: true, trim: true }, [rules.mobile()]),

    address: schema.string.optional({ escape: true, trim: true }),

    city: schema.string.optional({ escape: true, trim: true }, [rules.maxLength(20)]),

    countryId: schema.number.optional([
      rules.unsigned(),
      rules.exists({ table: 'countries', column: 'id' }),
    ]),

    stateId: schema.number.optional([
      rules.unsigned(),
      rules.exists({ table: 'states', column: 'id', where: { country_id: this.refs.countryId } }),
    ]),
  })

  public messages = {
    'email.required': 'Email is required.',
    'email.email': 'Email is not valid.',
    'email.unique': 'This email is already used.',
    'firstName.required': 'First Name is required.',
    'firstName.maxLength': 'First Name should be maximum of {{options.choices}} characters.',
    'middleName.maxLength': 'First Name should be maximum of {{options.choices}} characters.',
    'lastName.required': 'Last Name is required.',
    'lastName.maxLength': 'First Name should be maximum of {{options.choices}} characters.',
    'newPassword.required': 'New Password is required.',
    'newPassword.regex': 'Please provide a strong password.',
    'confirmNewPassword.equalTo': 'Both passwords should be the same.',
    'confirmNewPassword.required': 'Confirm New Password is required.',
    'phoneNumber.mobile': 'Phone number is not valid',
    'city.maxLength': 'City should be maximum of {{options.choices}} characters.',
    'stateId.unsigned': 'State is invalid',
    'stateId.number': 'State is invalid',
    'countryId.unsigned': 'Country is invalid',
    'countryId.number': 'Country is invalid',
  }
}
