import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { urlRegex } from 'App/Helpers/utils'

export default class CompanyValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({ companyId: this.ctx.params?.company_id ?? null })

  public schema = schema.create({
    isPersonalBrand: schema.boolean(),
    name: schema.string({ escape: true, trim: true }),
    email: schema.string({ escape: true, trim: true }, [
      rules.email(),
      rules.unique({
        column: 'email',
        table: 'companies',
        whereNot: this.refs.companyId ? { id: this.refs.companyId } : {},
      }),
    ]),
    phoneNumber: schema.string.optional({ escape: true, trim: true }, [rules.mobile()]),
    address: schema.string.optional({ escape: true, trim: true }),
    city: schema.string.optional({ escape: true, trim: true }),
    size: schema.number([rules.unsigned()]),
    stateId: schema.number.optional([rules.unsigned()]),
    countryId: schema.number.optional([rules.unsigned()]),
    website: schema.string.optional({ trim: true }, [rules.regex(urlRegex)]),
  })

  public messages = {
    'name.required': 'Name is required.',
    'email.required': 'Email is required.',
    'email.email': 'Email is not valid.',
    'email.unique': 'This email is already used.',
    'phoneNumber.mobile': 'Phone number is not valid',
    'website.regex': 'Website is not valid',
    'stateId.unsigned': 'State is invalid',
    'stateId.number': 'State is invalid',
    'countryId.unsigned': 'Country is invalid',
    'countryId.number': 'Country is invalid',
    'size.unsigned': 'Company Size is invalid',
    'size.number': 'Company Size is invalid',
  }
}
