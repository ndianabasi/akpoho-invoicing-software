import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import State from 'App/Models/State'

export default class Country extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public capital: string

  @column()
  public citizenship: string

  @column()
  public numericCode: string

  @column()
  public countryCode: string

  @column()
  public currency: string

  @column()
  public currencyCode: string

  @column()
  public currencySubUnit: string

  @column()
  public currencySymbol: string

  @column()
  public currencyDecimals: number

  @column()
  public fullName: string

  @column()
  public iso_3166_2: string

  @column()
  public iso_3166_3: string

  @column()
  public regionCode: string

  @column()
  public subRegionCode: string

  @column()
  public eea: boolean

  @column()
  public callingCode: string

  @column()
  public flag: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => State)
  public states: HasMany<typeof State>
}
