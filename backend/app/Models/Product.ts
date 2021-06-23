import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import ProductType from './ProductType'
import AttributeSet from './AttributeSet'
import ProductCategory from './ProductCategory'

export default class Product extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column({ isPrimary: true })
  public productTypeId: string

  @column({ isPrimary: true })
  public attributeSetId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => ProductType)
  public type: BelongsTo<typeof ProductType>

  @belongsTo(() => AttributeSet)
  public attributeSet: BelongsTo<typeof AttributeSet>

  @manyToMany(() => ProductCategory)
  public categories: ManyToMany<typeof ProductCategory>
}
