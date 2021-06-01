import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import UUIDHook from 'App/Models/Hooks/UUIDHook'
import Customer from 'App/Models/Customer'
import Country from 'App/Models/Country'
import State from 'App/Models/State'

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
  public addressType: string

  @column({ serializeAs: null })
  public stateId: number

  @column({ serializeAs: null })
  public countryId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
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
