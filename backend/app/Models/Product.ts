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

  @column()
  public attributeSetId: string

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public sku: string

  @column()
  public price: number

  @column()
  public isEnabled: boolean

  @column()
  public visibility: 'Catalogue Only' | 'Search Only' | 'Catalogue and Search' | 'Embedded'

  @column()
  public stockStatus: 'In Stock' | 'Out of Stock' | 'Made to Order' | 'Drop-shipped'

  @column()
  public productHasWeight: boolean

  @column()
  public description: string

  @column()
  public shortDescription: string

  @column()
  public productImages: number

  @column()
  public weight: number

  @column()
  public countryOfManufacture: number

  @column()
  public activeFrom: DateTime

  @column()
  public activeTo: DateTime

  @column()
  public metaDescription: string

  @column()
  public metaKeywords: string

  @column()
  public metaRobots: string

  @column()
  public metaTitle: string

  @column()
  public minimumAdvertisedPrice: number

  @column()
  public displayActualPrice: boolean

  @column()
  public productNewFromDate: DateTime

  @column()
  public productNewToDate: DateTime

  @column()
  public seoName: string

  @column()
  public specialPrice: number

  @column()
  public specialPriceFromDate: DateTime

  @column()
  public specialPriceToDate: DateTime

  @column()
  public isForOneTimePurchase: boolean

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

  @manyToMany(() => Company, { pivotTimestamps: true })
  public companies: ManyToMany<typeof Company>
}
