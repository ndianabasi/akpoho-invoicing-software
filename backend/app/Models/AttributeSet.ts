import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  column,
  HasMany,
  hasMany,
  hasManyThrough,
  HasManyThrough,
} from '@ioc:Adonis/Lucid/Orm'
import Product from './Product'
import Attribute from './Attribute'
import AttributeGroup from './AttributeGroup'
import UUIDHook from './Hooks/UUIDHook'

export default class AttributeSet extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public sortOrder: number

  @column()
  public isSystem: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Product)
  public products: HasMany<typeof Product>

  @hasMany(() => AttributeGroup)
  public attributeGroups: HasMany<typeof AttributeGroup>

  @hasManyThrough([() => Attribute, () => AttributeGroup])
  public attributes: HasManyThrough<typeof Attribute>

  @beforeCreate()
  public static generateUUID(model: AttributeSet) {
    UUIDHook.generateUUID(model, 'id')
  }
}
