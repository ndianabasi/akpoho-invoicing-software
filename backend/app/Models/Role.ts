import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  column,
  hasMany,
  HasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Permission from 'App/Models/Permission'
import UUIDHook from 'App/Models/Hooks/UUIDHook'

export default class Role extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => User)
  public users: HasMany<typeof User>

  @manyToMany(() => Permission)
  public permissions: ManyToMany<typeof Permission>

  @beforeCreate()
  public static generateUUID(model: Role) {
    UUIDHook.generateUUID(model)
  }
}
