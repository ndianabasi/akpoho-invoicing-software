import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { TIMEZONE_DATE_TIME_FORMAT } from 'App/Helpers/utils'
import Attribute from './Attribute'

export default class FieldInputType extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public code: string

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

  @hasMany(() => Attribute)
  public attributes: HasMany<typeof Attribute>
}
