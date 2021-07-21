import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({ userId: this.ctx.params?.user_id ?? null })

  public schema = schema.create({
    first_name: schema.string({ escape: true, trim: true }, [rules.maxLength(20)]),
    middle_name: schema.string.optional({ escape: true, trim: true }, [rules.maxLength(20)]),
    last_name: schema.string({ escape: true, trim: true }, [rules.maxLength(20)]),

    phone_number: schema.string.optional({ escape: true, trim: true }, [rules.mobile()]),

    address: schema.string.optional({ escape: true, trim: true }),
    city: schema.string.optional({ escape: true, trim: true }, [rules.maxLength(20)]),

    email: schema.string({ escape: true, trim: true }, [
      rules.email(),
      rules.unique({
        column: 'email',
        table: 'users',
        whereNot: this.refs.userId ? { id: this.refs.userId } : {},
      }),
    ]),

    role_id: schema.string({ escape: true, trim: true }, [rules.uuid({ version: 5 })]),
    state_id: schema.number.optional([rules.unsigned()]),
    country_id: schema.number.optional([rules.unsigned()]),
    login_status: schema.boolean(),
    profile_picture: schema.file.optional({ extnames: ['jpg', 'gif', 'png'], size: '5mb' }),
  })

  public messages = {
    'first_name.required': 'First Name is required.',
    'first_name.alpha': 'First Name should be only alphabets. Spaces and dashes are allowed.',
    'first_name.maxLength': 'First Name should be maximum of {{options.choices}} characters.',
    'middle_name.alpha': 'Middle Name should be only alphabets. Spaces and dashes are allowed.',
    'middle_name.maxLength': 'First Name should be maximum of {{options.choices}} characters.',
    'last_name.required': 'Last Name is required.',
    'last_name.alpha': 'First Name should be only alphabets. Spaces and dashes are allowed.',
    'last_name.maxLength': 'First Name should be maximum of {{options.choices}} characters.',
    'email.required': 'Email is required.',
    'email.email': 'Email is not valid.',
    'email.unique': 'This email is already used.',
    'role_id.required': 'Role is required.',
    'phone_number.mobile': 'Phone number is not valid',
    'city.maxLength': 'City should be maximum of {{options.choices}} characters.',
    'role_id.regex': 'Role is not valid',
    'state_id.unsigned': 'State is invalid',
    'state_id.number': 'State is invalid',
    'country_id.unsigned': 'Country is invalid',
    'country_id.number': 'Country is invalid',
  }
}
