import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import UUIDHook from './Hooks/UUIDHook'

export default class PasswordHistory extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

  @column()
  public oldPassword: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static generateUUID(model: PasswordHistory) {
    UUIDHook.generateUUID(model, 'id')
  }
}
