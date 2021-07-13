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
import Company from './Company'
import { DATE_FORMAT } from 'App/Helpers/utils'

export type DiscountType = 'percentage' | 'number'
export type RoundingType = 'none' | 'nearest' | 'down' | 'up'
export type ThousandSeparator = 'comma' | 'period' | 'none' | 'space'
export type AdditionalFee = { name: string; amount: number }
export type InvoiceQuotationType = 'invoice' | 'quotation'

export default class InvoiceQuotation extends BaseModel {
  public static selfAssignPrimaryKey = true
  public static table = 'invoices_quotations'
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public customerId: string

  @column()
  public companyId: string

  @column()
  public type: InvoiceQuotationType

  @column()
  public customerShippingAddress: string

  @column()
  public customerBillingAddress: string

  @column.dateTime({
    serialize(value: DateTime) {
      return value ? value.toFormat(DATE_FORMAT) : ''
    },
  })
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

  @column({ serialize: (value) => Boolean(value) })
  public simpleQuantities: boolean

  @column({ serialize: (value) => Boolean(value) })
  public amountsAreTaxInclusive: boolean

  @column()
  public taxPercentage: number

  @column({ serialize: (value) => Boolean(value) })
  public roundAmounts: boolean

  @column()
  public roundAmountType: RoundingType

  @column({ serialize: (value) => Boolean(value) })
  public showDiscounts: boolean

  @column()
  public discountType: DiscountType

  @column({ serialize: (value) => Boolean(value) })
  public setDiscountTypePerLine: boolean

  @column({ serialize: (value) => Boolean(value) })
  public calculateTotals: boolean

  @column({ serialize: (value) => Boolean(value) })
  public changeProductPrices: boolean

  @column()
  public numberOfDecimals: number

  @column({ serialize: (value) => Boolean(value) })
  public useThousandSeparator: boolean

  @column()
  public thousandSeparatorType: ThousandSeparator

  @column({ serialize: (value) => Boolean(value) })
  public showAdditionalSubtotalDiscount: boolean

  @column()
  public additionalDiscountType: DiscountType

  @column()
  public additionalDiscountAmount: number

  @column({ serialize: (value) => Boolean(value) })
  public showAdditionalFees: boolean

  @column({ serialize: (value) => Boolean(value) })
  public showImages: boolean

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
    invoiceQuotation.additionalFees = invoiceQuotation.additionalFees
      ? JSON.parse(invoiceQuotation.additionalFees as string)
      : undefined
  }

  @afterFetch()
  public static async parseAllFormats(invoiceQuotations: InvoiceQuotation[]) {
    invoiceQuotations.map((invoiceQuotation) => {
      invoiceQuotation.additionalFees = invoiceQuotation.additionalFees
        ? JSON.parse(invoiceQuotation.additionalFees as string)
        : undefined
      return invoiceQuotation
    })
  }

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @belongsTo(() => CustomerAddress, {
    serializeAs: 'shipping_address',
    foreignKey: 'customerShippingAddress',
    onQuery(query) {
      query.where('address_type', 'shipping_address')
    },
  })
  public shippingAddress: BelongsTo<typeof CustomerAddress>

  @belongsTo(() => CustomerAddress, {
    serializeAs: 'billing_address',
    foreignKey: 'customerBillingAddress',
    onQuery(query) {
      query.where('address_type', 'billing_address')
    },
  })
  public billingAddress: BelongsTo<typeof CustomerAddress>

  @hasMany(() => InvoiceQuotationItem, { foreignKey: 'invoicesQuotationsId' })
  public items: HasMany<typeof InvoiceQuotationItem>
}
