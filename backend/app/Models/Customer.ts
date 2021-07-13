import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  computed,
} from '@ioc:Adonis/Lucid/Orm'
import Company from 'App/Models/Company'
import CustomerAddress from 'App/Models/CustomerAddress'
import UUIDHook from './Hooks/UUIDHook'
import { TIMEZONE_DATE_TIME_FORMAT } from 'App/Helpers/utils'
import CustomerTitle from './CustomerTitle'
import InvoiceQuotation from './InvoiceQuotation'

export default class Customer extends BaseModel {
  public static selfAssignPrimaryKey = true
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: string

  @column({
    serializeAs: null,
  })
  public companyId: string

  @column()
  public firstName: string

  @column()
  public middleName: string

  @column()
  public lastName: string

  @column()
  public email: string

  @column()
  public phoneNumber: string

  @column({
    serialize(value: number) {
      return Boolean(value)
    },
  })
  public isCorporate: boolean

  @column({
    serializeAs: null,
  })
  public customerTitleId: number

  @column({
    serialize(value: number) {
      return Boolean(value)
    },
  })
  public corporateHasRep: boolean

  @column()
  public companyName: string

  @column()
  public companyEmail: string

  @column()
  public companyPhone: string

  @column.dateTime({
    autoCreate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(TIMEZONE_DATE_TIME_FORMAT) : ''
    },
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(TIMEZONE_DATE_TIME_FORMAT) : ''
    },
  })
  public updatedAt: DateTime

  @computed({ serializeAs: 'customer_name' })
  public get customerName(): string {
    const isCorporate = Boolean(this.isCorporate)
    return isCorporate
      ? this.companyName + ' (corporate)'
      : `${this.firstName}${this.middleName ? ' ' + this.middleName : ''}${
          this.lastName ? ' ' + this.lastName : ''
        }`
  }

  @beforeCreate()
  public static generateUUID(model: Customer) {
    UUIDHook.generateUUID(model)
  }

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @hasMany(() => CustomerAddress)
  public addresses: HasMany<typeof CustomerAddress>

  @belongsTo(() => CustomerTitle)
  public title: BelongsTo<typeof CustomerTitle>

  @hasMany(() => InvoiceQuotation)
  public invoiceQuotations: HasMany<typeof InvoiceQuotation>

  @hasMany(() => InvoiceQuotation, {
    foreignKey: 'customerId',
    onQuery: (query) => {
      query.where('type', 'invoice')
    },
  })
  public invoices: HasMany<typeof InvoiceQuotation>

  @hasMany(() => InvoiceQuotation, {
    foreignKey: 'customerId',
    onQuery: (query) => {
      query.where('type', 'quotation')
    },
  })
  public quotations: HasMany<typeof InvoiceQuotation>
}
