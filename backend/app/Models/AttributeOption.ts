import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Attribute from './Attribute'
import UUIDHook from './Hooks/UUIDHook'

export default class AttributeOption extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Attribute, {
    pivotTimestamps: true,
    pivotColumns: ['sort_order'],
  })
  public options: ManyToMany<typeof Attribute>

  @beforeCreate()
  public static generateUUID(model: AttributeOption) {
    UUIDHook.generateUUID(model, 'id')
  }
}
