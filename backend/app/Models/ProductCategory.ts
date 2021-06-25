import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Product from 'App/Models/Product'
import Company from 'App/Models/Company'

export default class ProductCategory extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Product, {
    pivotTimestamps: true,
  })
  public categories: ManyToMany<typeof Product>

  @manyToMany(() => Company, { pivotTimestamps: true })
  public companies: ManyToMany<typeof Company>
}
