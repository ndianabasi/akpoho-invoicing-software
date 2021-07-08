import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import UUIDHook from 'App/Models/Hooks/UUIDHook'
import Customer from 'App/Models/Customer'
import Country from 'App/Models/Country'
import State from 'App/Models/State'
import { ADDRESS_TYPE, TIMEZONE_DATE_TIME_FORMAT } from 'App/Helpers/utils'

export default class CustomerAddress extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public streetAddress: string

  @column({ serializeAs: null })
  public customerId: string

  @column()
  public city: string

  @column()
  public postalCode: string

  @column()
  public addressType: ADDRESS_TYPE

  @column({ serializeAs: null })
  public stateId: number | null

  @column({ serializeAs: null })
  public countryId: number | null

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

  @beforeCreate()
  public static generateUUID(model: CustomerAddress) {
    UUIDHook.generateUUID(model)
  }

  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>

  @belongsTo(() => Country)
  public addressCountry: BelongsTo<typeof Country>

  @belongsTo(() => State)
  public addressState: BelongsTo<typeof State>
}
