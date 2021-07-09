import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  discountTypes,
  itemCollectionTypes,
  QUOTATION_PRODUCT_NAME_TYPES,
  roundingTypes,
  thousandSeparatorTypes,
  unitOfMeasurementTypes,
} from 'App/Helpers/utils'

export default class QuotationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    items: schema.array().members(
      schema.object().members({
        productId: schema.string(),
        productNameType: schema.enum(QUOTATION_PRODUCT_NAME_TYPES),
        productName: schema.string(),
        description: schema.string.optional(),
        qty: schema.number(),
        UOM: schema.enum(unitOfMeasurementTypes),
        collectionType: schema.enum(itemCollectionTypes),
        groupQty: schema.number(),
        unitPrice: schema.number(),
        unitDiscount: schema.number(),
        discountType: schema.enum(discountTypes),
        total: schema.number(),
        files: schema.array.optional().members(
          schema.file({
            size: '2mb',
            extnames: ['jpg', 'gif', 'png'],
          })
        ),
      })
    ),

    additionalFees: schema.array.optional().members(
      schema.object().members({
        name: schema.string(),
        amount: schema.number(),
      })
    ),

    date: schema.date(),
    code: schema.string(),
    customerId: schema.string(),
    customerAddressId: schema.string(),
    introduction: schema.string.optional(),
    title: schema.string(),
    simpleQuantities: schema.boolean(),
    amountsAreTaxInclusive: schema.boolean(),
    taxPercentage: schema.number.optional(),
    roundAmounts: schema.boolean(),
    roundAmountType: schema.enum(roundingTypes),
    showDiscounts: schema.boolean(),
    discountType: schema.enum(discountTypes),
    setDiscountTypePerLine: schema.boolean(),
    calculateTotals: schema.boolean(),
    changeProductPrices: schema.boolean(),
    numberOfDecimals: schema.number.optional(),
    useThousandSeparator: schema.boolean(),
    thousandSeparatorType: schema.enum(thousandSeparatorTypes),
    notes: schema.string.optional(),
    theme: schema.string.optional(),
    showAdditionalSubtotalDiscount: schema.boolean(),
    additionalDiscountType: schema.enum(discountTypes),
    additionalDiscountAmount: schema.number.optional(),
    showAdditionalFees: schema.boolean(),
    showImages: schema.boolean(),
  })

  public messages = {
    'items.required': 'Items are required. You cannot submit an empty list of items.',
    'items.*.productId.required': 'Product is required.',
  }
}
