import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  hasManyThrough,
  HasManyThrough,
} from '@ioc:Adonis/Lucid/Orm'
import Product from 'App/Models/Product'
import Attribute from 'App/Models/Attribute'
import AttributeGroup from 'App/Models/AttributeGroup'
import UUIDHook from 'App/Models/Hooks/UUIDHook'
import Company from 'App/Models/Company'

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

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @beforeCreate()
  public static generateUUID(model: AttributeSet) {
    UUIDHook.generateUUID(model, 'id')
  }
}
