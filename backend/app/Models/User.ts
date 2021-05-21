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
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import UserHook from 'App/Models/Hooks/UserHook'
import Company from 'App/Models/Company'
import Role from 'App/Models/Role'
import UserProfile from 'App/Models/UserProfile'

export default class User extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column(/* { prepare: async (value: string) => await UserHook.preparePassword(value) } */)
  public password: string

  @column()
  public email: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column()
  public roleId: string | null

  @column()
  public loginCode: number

  @column()
  public activationCode: string

  @column()
  public forgotPasswordCode: number

  @column()
  public loginStatus: boolean

  @column()
  public isAccountActivated: boolean

  @column()
  public isEmailVerified: boolean

  @column()
  public lifetimeLogin: number

  @column()
  public passwordChangeRequired: boolean

  @column()
  public rememberToken: boolean

  @column()
  public lastLoginTime: DateTime

  @column()
  public accountActivatedAt: DateTime

  @column()
  public emailVerifiedAt: DateTime

  @column()
  public forgotPasswordCodeExpiresAt: DateTime

  @column({ prepare: (value) => value.toFormat('yyyy-LL-dd HH:mm:ss') })
  public activationCodeExpiresAt: DateTime

  @column()
  public loginCodeExpiresAt: DateTime

  @column()
  public passwordLastChangedAt: DateTime

  @column()
  public passwordChangeSecret: string

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
  public static async hashPassword(user: User) {
    await UserHook.hashPassword(user)
  }

  @manyToMany(() => Company)
  public companies: ManyToMany<typeof Company>

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @hasOne(() => UserProfile)
  public profile: HasOne<typeof UserProfile>
}
