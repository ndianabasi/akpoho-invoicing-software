import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  beforeCreate,
  belongsTo,
  BelongsTo,
  afterFetch,
} from '@ioc:Adonis/Lucid/Orm'
import UuidHook from 'App/Models/Hooks/UUIDHook'
import User from 'App/Models/User'
import Country from 'App/Models/Country'
import State from 'App/Models/State'
import UploadedFile, { FileFormats } from 'App/Models/UploadedFile'

export default class UserProfile extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

  @column()
  public firstName: string

  @column()
  public middleName: string | null

  @column()
  public lastName: string

  @column()
  public phoneNumber: string | null

  @column()
  public address: string | null

  @column()
  public city: string | null

  @column()
  public stateId: number | null

  @column()
  public countryId: number | null

  @column()
  public profilePicture: number | null

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

  @belongsTo(() => UploadedFile, { foreignKey: 'profilePicture' })
  public profilePictureFile: BelongsTo<typeof UploadedFile>
}
