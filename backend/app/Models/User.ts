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
  hasMany,
  HasMany,
  scope,
  computed,
} from '@ioc:Adonis/Lucid/Orm'
import UserHook from 'App/Models/Hooks/UserHook'
import Company from 'App/Models/Company'
import Role from 'App/Models/Role'
import UserProfile from 'App/Models/UserProfile'
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils'
import PasswordChange from 'App/Models/PasswordChange'
import PasswordHistory from 'App/Models/PasswordHistory'
import LoginRecord from 'App/Models/LoginRecord'

export default class User extends BaseModel {
  public static selfAssignPrimaryKey = true

  // Column definitions
  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public email: string

  @column()
  public roleId: string | null

  @column()
  public loginCode: number | null

  @column()
  public activationCode: string

  @column()
  public forgotPasswordCode: string

  @column({
    serialize(value: number) {
      return Boolean(value)
    },
  })
  public loginStatus: boolean

  @column({
    serialize(value: number) {
      return Boolean(value)
    },
  })
  public isAccountActivated: boolean

  @column({
    serialize(value: number) {
      return Boolean(value)
    },
  })
  public isEmailVerified: boolean

  @column()
  public lifetimeLogin: number

  @column({
    serialize(value: number) {
      return Boolean(value)
    },
  })
  public passwordChangeRequired: boolean

  @column({
    serialize(value: number) {
      return Boolean(value)
    },
  })
  public rememberToken: boolean

  @column.dateTime()
  public lastLoginTime: DateTime

  @column.dateTime()
  public accountActivatedAt: DateTime

  @column.dateTime()
  public emailVerifiedAt: DateTime

  @column.dateTime()
  public activationCodeExpiresAt: DateTime

  // Also used when user is changing their password while logged in
  @column.dateTime()
  public forgotPasswordCodeExpiresAt: DateTime

  @column.dateTime()
  public loginCodeExpiresAt: DateTime

  @column.dateTime()
  public passwordLastChangedAt: DateTime

  @column()
  public passwordChangeSecret: string

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : ''
    },
  })
  public updatedAt: DateTime

  @column.dateTime({
    autoCreate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : ''
    },
  })
  public createdAt: DateTime

  // CRUD Hooks
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

  // Relationships Hooks
  @manyToMany(() => Company)
  public companies: ManyToMany<typeof Company>

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @hasOne(() => UserProfile)
  public profile: HasOne<typeof UserProfile>

  @hasOne(() => PasswordChange)
  public passwordChange: HasOne<typeof PasswordChange>

  @hasMany(() => PasswordHistory)
  public passwordHistories: HasMany<typeof PasswordHistory>

  @hasMany(() => LoginRecord)
  public loginRecords: HasMany<typeof LoginRecord>

  // Query scopes
  public static companyAdmins = scope((query, companyId: Company['id']) => {
    query.leftJoin('roles', (rolesQuery) => rolesQuery.on('users.role_id', '=', 'roles.id'))
    query.leftJoin('company_user', (rolesQuery) =>
      rolesQuery.on('users.id', '=', 'company_user.user_id')
    )
    query.where('roles.name', 'CompanyAdmin')
    query.where('company_user.company_id', companyId)
  })

  public static SuperAdmins = scope((query) => {
    query.leftJoin('roles', (rolesQuery) => rolesQuery.on('users.role_id', '=', 'roles.id'))
    query.where('roles.name', 'SuperAdmin')
  })
}
