import { DateTime } from 'luxon'
import {
  afterFetch,
  afterFind,
  BaseModel,
  beforeSave,
  belongsTo,
  BelongsTo,
  column,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import UUIDHook from './Hooks/UUIDHook'
import Customer from './Customer'
import CustomerAddress from './CustomerAddress'
import InvoiceQuotationItem from './InvoiceQuotationItem'

export type DiscountType = 'percentage' | 'number'
export type RoundingType = 'none' | 'nearest' | 'down' | 'up'
export type ThousandSeparator = 'comma' | 'period' | 'none' | 'space'
export type AdditionalFee = { name: string; amount: number }
export type InvoiceQuotationType = 'invoice' | 'quotation'

export default class InvoiceQuotation extends BaseModel {
  public static selfAssignPrimaryKey = true
  public static table = 'invoices_quotations'

  @column({ isPrimary: true })
  public id: string

  @column()
  public customerId: string

  @column()
  public productId: string

  @column()
  public type: InvoiceQuotationType

  @column()
  public customerShippingAddress: string

  @column()
  public customerBillingAddress: string

  @column.dateTime()
  public date: DateTime

  @column()
  public code: string

  @column()
  public title: string

  @column()
  public introduction: string

  @column()
  public notes: string

  @column()
  public additionalFees: AdditionalFee[] | string | null

  @column()
  public simpleQuantities: boolean

  @column()
  public amountsAreTaxInclusive: boolean

  @column()
  public taxPercentage: number

  @column()
  public roundAmounts: boolean

  @column()
  public roundAmountType: RoundingType

  @column()
  public showDiscounts: boolean

  @column()
  public discountType: DiscountType

  @column()
  public setDiscountTypePerLine: boolean

  @column()
  public calculateTotals: boolean

  @column()
  public changeProductPrices: boolean

  @column()
  public numberOfDecimals: number

  @column()
  public useThousandSeparator: boolean

  @column()
  public thousandSeparatorType: ThousandSeparator

  @column()
  public showAdditionalSubtotalDiscount: boolean

  @column()
  public additionalDiscountType: DiscountType

  @column()
  public additionalDiscountAmount: number

  @column()
  public showAdditionalFees: boolean

  @column()
  public showImage: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static generateUUID(model: InvoiceQuotation) {
    UUIDHook.generateUUID(model, 'id')
  }

  @beforeSave()
  public static async stringifyFormats(invoiceQuotation: InvoiceQuotation) {
    if (invoiceQuotation.$dirty.additionalFees && invoiceQuotation.additionalFees !== undefined) {
      invoiceQuotation.additionalFees = JSON.stringify(invoiceQuotation.additionalFees)
    }
  }

  @afterFind()
  public static async parseFormats(invoiceQuotation: InvoiceQuotation) {
    invoiceQuotation.additionalFees = JSON.parse(invoiceQuotation.additionalFees as string)
  }

  @afterFetch()
  public static async parseAllFormats(invoiceQuotations: InvoiceQuotation[]) {
    invoiceQuotations.map((invoiceQuotation) => {
      invoiceQuotation.additionalFees = JSON.parse(invoiceQuotation.additionalFees as string)
      return invoiceQuotation
    })
  }

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @belongsTo(() => CustomerAddress, {
    foreignKey: 'customerShippingAddress',
    onQuery(query) {
      query.where('address_type', 'shipping_address')
    },
  })
  public shippingAddress: BelongsTo<typeof CustomerAddress>

  @belongsTo(() => CustomerAddress, {
    foreignKey: 'customerBillingAddress',
    onQuery(query) {
      query.where('address_type', 'billing_address')
    },
  })
  public billingAddress: BelongsTo<typeof CustomerAddress>

  @hasMany(() => InvoiceQuotationItem, { foreignKey: 'invoicesQuotationsId' })
  public items: HasMany<typeof InvoiceQuotationItem>
}
