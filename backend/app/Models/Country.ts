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
  public numeric_code: string

  @column()
  public country_code: string

  @column()
  public currency: string

  @column()
  public currency_code: string

  @column()
  public currency_sub_unit: string

  @column()
  public currency_symbol: string

  @column()
  public currency_decimals: number

  @column()
  public full_name: string

  @column()
  public iso_3166_2: string

  @column()
  public iso_3166_3: string

  @column()
  public region_code: string

  @column()
  public sub_region_code: string

  @column()
  public eea: boolean

  @column()
  public calling_code: string

  @column()
  public flag: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => State)
  public states: HasMany<typeof State>
}
