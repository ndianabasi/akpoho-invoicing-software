import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { PRODUCT_STOCK_STATUS_OPTIONS } from 'App/Models/Product'

export default class ProductValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    productTypeId: schema.string({ escape: true, trim: true }, [rules.uuid({ version: 5 })]),

    productName: schema.string({ escape: true, trim: true }, [
      rules.minLength(6),
      rules.maxLength(50),
    ]),

    sku: schema.string.optional({ escape: true, trim: true }, [
      rules.minLength(4),
      rules.maxLength(16),
    ]),

    price: schema.number(),
    weight: schema.number.optional(),
    countryOfManufacture: schema.number.optional(),

    isEnabled: schema.boolean(),
    productHasWeight: schema.boolean(),

    stockStatus: schema.enum(PRODUCT_STOCK_STATUS_OPTIONS),

    description: schema.string.optional({ escape: true, trim: true }),
    shortDescription: schema.string.optional({ escape: true, trim: true }),
  })

  public messages = {
    'productTypeId.required': 'Product type is required.',
    'productTypeId.uuid': 'Product type specified is not valid.',

    'productName.minLength': 'Product Name should be minimum of {{options.choices}} characters.',
    'productName.maxLength': 'Product Name should be maximum of {{options.choices}} characters.',
    'productName.required': 'Product Name is required.',

    'sku.minLength': 'SKU should be minimum of {{options.choices}} characters.',
    'sku.maxLength': 'SKU should be maximum of {{options.choices}} characters.',

    'stockStatus.enum': 'Stock Status is invalid',
  }
}
