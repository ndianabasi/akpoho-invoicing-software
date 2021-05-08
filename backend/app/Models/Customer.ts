import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Company from 'App/Models/Company'
import CustomerAddress from 'App/Models/CustomerAddress'
import UUIDHook from './Hooks/UUIDHook'
import Country from 'App/Models/Country'
import State from 'App/Models/State'

export default class Customer extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
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

  @column()
  public isCorporate: boolean

  @column()
  public corporateHasRep: boolean

  @column()
  public companyName: string

  @column()
  public companyEmail: string

  @column()
  public companyStreetAddress: string

  @column()
  public companyCity: string

  @column()
  public companyPostalCode: string

  @column()
  public companyStateId: number

  @column()
  public companyCountryId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static generateUUID(model: CustomerAddress) {
    UUIDHook.generateUUID(model)
  }

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @belongsTo(() => Country, {
    foreignKey: 'companyCountryId',
    localKey: 'id',
  })
  public companyCountry: BelongsTo<typeof Country>

  @belongsTo(() => State, {
    foreignKey: 'companyStateId',
    localKey: 'id',
  })
  public companyState: BelongsTo<typeof State>

  @hasMany(() => CustomerAddress)
  public addresses: HasMany<typeof CustomerAddress>
}
