import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Company from 'App/Models/Company'

export default class CompanySize extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public size: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Company)
  public customers: HasMany<typeof Company>
}
