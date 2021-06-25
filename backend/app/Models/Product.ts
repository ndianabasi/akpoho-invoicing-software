import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import ProductType from 'App/Models/ProductType'
import AttributeSet from 'App/Models/AttributeSet'
import ProductCategory from 'App/Models/ProductCategory'
import Company from 'App/Models/Company'

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

  @manyToMany(() => ProductCategory, {
    pivotTimestamps: true,
  })
  public categories: ManyToMany<typeof ProductCategory>

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>
}
