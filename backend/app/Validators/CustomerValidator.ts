import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CustomerValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    customerId: this.ctx.params?.customer_id ?? null,
    companyId: this.ctx.requestedCompany?.id ?? null,
  })

  public schema = schema.create({
    title: schema.number.optional(),

    first_name: schema.string({ escape: true, trim: true }, [rules.maxLength(20)]),

    middle_name: schema.string.optional({ escape: true, trim: true }, [rules.maxLength(20)]),

    last_name: schema.string({ escape: true, trim: true }, [rules.maxLength(20)]),

    email: schema.string.optional({ escape: true, trim: true }, [
      rules.email(),
      rules.unique({
        column: 'email',
        table: 'customers',
        where: { company_id: this.refs.companyId },
        whereNot: this.refs.customerId ? { id: this.refs.customerId } : {},
      }),
    ]),

    phone_number: schema.string.optional({ escape: true, trim: true }, [rules.mobile()]),

    is_corporate: schema.boolean.optional(),
    corporate_has_rep: schema.boolean.optional(),

    company_name: schema.string.optional({ escape: true, trim: true }),

    company_phone: schema.string.optional({ escape: true, trim: true }, [rules.mobile()]),

    company_email: schema.string.optional({ escape: true, trim: true }, [
      rules.email(),
      rules.unique({
        column: 'company_email',
        table: 'customers',
        where: { company_id: this.refs.companyId },
        whereNot: this.refs.customerId ? { id: this.refs.customerId } : {},
      }),
    ]),

    shipping_address: schema.string.optional({ escape: true, trim: true }),
    shipping_lga: schema.string.optional({ escape: true, trim: true }),
    shipping_postal_code: schema.string.optional({ escape: true, trim: true }),
    shipping_state: schema.number.optional([rules.unsigned()]),
    shipping_country: schema.number.optional([rules.unsigned()]),

    billing_address: schema.string.optional({ escape: true, trim: true }),
    billing_lga: schema.string.optional({ escape: true, trim: true }),
    billing_postal_code: schema.string.optional({ escape: true, trim: true }),
    billing_state: schema.number.optional([rules.unsigned()]),
    billing_country: schema.number.optional([rules.unsigned()]),
    is_billing_shipping_addresses_same: schema.boolean(),
  })

  public messages = {
    'first_name.maxLength': 'First Name should be maximum of {{options.choices}} characters.',
    'first_name.required': 'First Name is required.',
    'middle_name.maxLength': 'First Name should be maximum of {{options.choices}} characters.',
    'last_name.maxLength': 'First Name should be maximum of {{options.choices}} characters.',
    'last_name.required': 'Last Name is required.',
    'email.email': 'Personal Email Address is not valid.',
    'email.unique': 'Personal Email Address is already used within your company.',
    'phone_number.mobile': 'Personal Phone number is not valid',
    'company_phone.mobile': 'Company Phone number is not valid',
    'company_email.email': 'Company Email Address is not valid.',
    'company_email.unique': 'Company Email Address is already used within your company.',
  }
}
