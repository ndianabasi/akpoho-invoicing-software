import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import InvoiceQuotationItem from './InvoiceQuotationItem'

export type UnitOfMeasurementTypes = 'collection' | 'discrete'

export default class UnitOfMeasurement extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public type: UnitOfMeasurementTypes

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => InvoiceQuotationItem, { foreignKey: 'unitOfMeasurementId' })
  public unitOfMeasurementInvoiceQuotations: HasMany<typeof InvoiceQuotationItem>

  @hasMany(() => InvoiceQuotationItem, { foreignKey: 'collectionTypeId' })
  public collectionTypeInvoiceQuotations: HasMany<typeof InvoiceQuotationItem>
}
