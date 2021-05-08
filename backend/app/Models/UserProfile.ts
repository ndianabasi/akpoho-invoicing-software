import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import UuidHook from './Hooks/UUIDHook'
import User from 'App/Models/User'
import Country from 'App/Models/Country'
import State from 'App/Models/State'

export default class UserProfile extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

  @column()
  public firstName: string

  @column()
  public middleName: string

  @column()
  public lastName: string

  @column()
  public phoneNumber: string

  @column()
  public address: string

  @column()
  public city: string

  @column()
  public state: number

  @column()
  public country: number

  @column()
  public profilePicture: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static generateUUID(model: UserProfile) {
    UuidHook.generateUUID(model)
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Country)
  public userCountry: BelongsTo<typeof Country>

  @belongsTo(() => State)
  public userState: BelongsTo<typeof State>
}
