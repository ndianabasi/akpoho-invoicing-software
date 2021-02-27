import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  beforeCreate,
  beforeSave,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import UserHook from './Hooks/UserHook'
import Company from 'App/Models/Company'
import Role from 'App/Models/Role'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public password: string

  @column()
  public email: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column()
  public role_id: string
  @column()
  public login_code: number
  @column()
  public activation_code: string
  @column()
  public forgot_password_code: number
  @column()
  public login_status: boolean
  @column()
  public is_account_activated: boolean
  @column()
  public is_email_verified: boolean
  @column()
  public lifetime_login: number
  @column()
  public password_change_required: boolean
  @column()
  public remember_token: boolean
  @column()
  public last_login_time: DateTime
  @column()
  public account_activated_at: DateTime
  @column()
  public email_verified_at: DateTime
  @column()
  public forgot_password_code_expires_at: DateTime
  @column()
  public activation_code_expires_at: DateTime
  @column()
  public login_code_expires_at: DateTime
  @column()
  public password_last_changed_at: DateTime
  @column()
  public password_change_secret: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static generateUUID(user: User) {
    UserHook.generateUUID(user)
  }

  @beforeCreate()
  public static generateActivationCode(user: User) {
    UserHook.generateActivationCode(user)
  }

  @beforeSave()
  public static hashPassword(user: User) {
    UserHook.hashPassword(user)
  }

  @manyToMany(() => Company)
  public companies: ManyToMany<typeof Company>

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>
}
