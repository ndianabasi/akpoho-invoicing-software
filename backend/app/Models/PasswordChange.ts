import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  beforeSave,
  belongsTo,
  BelongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import UUIDHook from './Hooks/UUIDHook'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import { generateCode } from 'App/Helpers/utils'

export default class PasswordChange extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

  @column()
  public secret: string

  @column({
    serializeAs: null,
  })
  public newPassword: string

  @column()
  public verificationCode: number

  @column.dateTime()
  public verificationCodeExpiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static generateUUID(model: PasswordChange) {
    UUIDHook.generateUUID(model, 'id')
  }

  @beforeSave()
  public static async hashPassword(passwordChange: PasswordChange) {
    if (passwordChange.$dirty.newPassword) {
      passwordChange.newPassword = await Hash.make(passwordChange.newPassword)
    }
  }

  @beforeSave()
  public static async createVerificationExpirationTime(passwordChange: PasswordChange) {
    if (!passwordChange.$dirty.verificationCodeExpiresAt) {
      passwordChange.verificationCodeExpiresAt = DateTime.now().plus({ hours: 2 })
    }
  }

  @beforeSave()
  public static async createVerificationCode(passwordChange: PasswordChange) {
    if (!passwordChange.$dirty.verificationCode) {
      const code = await generateCode(100000, 999999)
      passwordChange.verificationCode = code
    }
  }

  @beforeSave()
  public static async createSecret(model: PasswordChange) {
    if (!model.$dirty.secret) {
      UUIDHook.generateUUID(model, 'secret')
    }
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
