import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import UUIDHook from './Hooks/UUIDHook'
import { TIMEZONE_DATE_TIME_FORMAT } from 'App/Helpers/utils'

export default class LoginRecord extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

  @column()
  public ipAddress: string

  @column()
  public location: string

  @column.dateTime({
    autoCreate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(TIMEZONE_DATE_TIME_FORMAT) : ''
    },
  })
  public timestamp: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @beforeCreate()
  public static generateUUID(model: LoginRecord) {
    UUIDHook.generateUUID(model, 'id')
  }
}
