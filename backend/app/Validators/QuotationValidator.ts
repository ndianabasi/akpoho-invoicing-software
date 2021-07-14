import { schema, rules } from '@ioc:Adonis/Core/Validator'
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
        productId: schema.string.optional({ escape: true, trim: true }, [
          rules.minLength(6),
          rules.maxLength(50),
        ]),
        productNameType: schema.enum(QUOTATION_PRODUCT_NAME_TYPES),
        productName: schema.string.optional({ escape: true, trim: true }, [
          rules.minLength(6),
          rules.maxLength(50),
        ]),
        /**
         * Description could contain HTML tags. We do not want those tags
         * to be sanitised. So we will skip `escape` here and sanitise it
         * in the controller
         */
        description: schema.string.optional({ trim: true }),
        qty: schema.number(),
        UOM: schema.enum(unitOfMeasurementTypes),
        collectionTypeId: schema.enum(itemCollectionTypes),
        groupQty: schema.number.optional(),
        unitPrice: schema.number(),
        unitDiscount: schema.number.optional(),
        discountType: schema.enum(discountTypes),
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
        name: schema.string({ escape: true, trim: true }, [
          rules.minLength(6),
          rules.maxLength(50),
        ]),
        amount: schema.number(),
      })
    ),

    date: schema.date(),
    code: schema.string.optional({ escape: true, trim: true }, [
      rules.minLength(4),
      rules.maxLength(20),
    ]),
    customerId: schema.string({ escape: true, trim: true }, [rules.uuid({ version: 5 })]),
    customerShippingAddressId: schema.string.optional({ escape: true, trim: true }, [
      rules.uuid({ version: 5 }),
    ]),
    customerBillingAddressId: schema.string.optional({ escape: true, trim: true }, [
      rules.uuid({ version: 5 }),
    ]),
    /**
     * Introduction could contain HTML tags. We do not want those tags
     * to be sanitised. So we will skip `escape` here and sanitise it
     * in the controller
     */
    introduction: schema.string.optional({ trim: true }),
    title: schema.string({ escape: true, trim: true }, [rules.minLength(6), rules.maxLength(100)]),
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
    /**
     * Notes could contain HTML tags. We do not want those tags
     * to be sanitised. So we will skip `escape` here and sanitise it
     * in the controller
     */
    notes: schema.string.optional({ trim: true }),
    theme: schema.string.optional({ trim: true }, [rules.uuid({ version: 5 })]),
    showAdditionalSubtotalDiscount: schema.boolean(),
    additionalDiscountType: schema.enum(discountTypes),
    additionalDiscountAmount: schema.number.optional(),
    showAdditionalFees: schema.boolean(),
    showImages: schema.boolean(),
  })

  public messages = {
    'items.required': 'Items are required. You cannot submit an empty list of items.',
    'items.*.productId.required': 'Product name/id is required for an item.',
    'items.*.productId.minLength': 'Minimum length of product name/id is {{options.choices}}.',
    'items.*.productId.maxLength': 'Maximum length of product name/id is {{options.choices}}.',
    'items.*.productNameType.enum': 'Invalid product type was provided for an item.',
    'items.*.productName.minLength': 'Minimum length of product name is {{options.choices}}.',
    'items.*.productName.maxLength': 'Maximum length of product name is {{options.choices}}.',
    'items.*.qty.required': 'Quantity is required for an item',
    'items.*.UOM.required': 'Unit of measurement is required for an item',
    'items.*.collectionTypeId.enum': 'Invalid collection type was provided for an item.',
    'items.*.unitPrice.required': 'Unit Price is required for an item',
    'items.*.discountType.enum': 'Invalid discount type was provided for an item.',
    'items.*.files.*.file':
      'Provided file is invalid for an item. Size should be 2MB maximum and accepted file types are JPG, GIF, & PNG.',
    'additionalFees.*.name.minLength':
      'Minimum length of additional fee name is {{options.choices}}',
    'additionalFees.*.name.maxLength':
      'Maximum length of additional fee name is {{options.choices}}',
    'date.required': 'Quotation Date is required',
    'code.minLength': 'Minimum length of quotation code is {{options.choices}}',
    'code.maxLength': 'Maximum length of quotation code is {{options.choices}}',
    'customerId.required': 'Customer is required',
    'customerId.uuid': 'Customer is invalid',
    'customerShippingAddressId.uuid': 'Customer Shipping Address is invalid',
    'customerBillingAddressId.uuid': 'Customer Billing Address is invalid',
    'title.required': 'Quotation Title is required',
    'title.minLength': 'Minimum length of quotation Title is {{options.choices}}',
    'title.maxLength': 'Maximum length of quotation Title is {{options.choices}}',
    'theme.uuid': 'Theme is invalid',
  }
}
