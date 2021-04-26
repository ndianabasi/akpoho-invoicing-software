import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Company from 'App/Models/Company'
import CustomerAddress from 'App/Models/CustomerAddress'

export default class Customer extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @hasMany(() => CustomerAddress)
  public addresses: HasMany<typeof CustomerAddress>
}
