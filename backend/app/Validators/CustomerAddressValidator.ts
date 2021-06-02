import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CustomerValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    address: schema.string.optional({ escape: true, trim: true }),
    lga: schema.string.optional({ escape: true, trim: true }),
    postal_code: schema.string.optional({ escape: true, trim: true }),
    state: schema.number.optional([rules.unsigned()]),
    country: schema.number.optional([rules.unsigned()]),
    type: schema.enum(['shipping_address', 'billing_address']),
  })

  public messages = {}
}
