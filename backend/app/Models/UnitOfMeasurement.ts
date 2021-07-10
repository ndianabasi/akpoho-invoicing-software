import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import InvoiceQuotationItem from './InvoiceQuotationItem'

export type UnitOfMeasurementTypes = 'collection' | 'discrete'
export type UnitsOfMeasurement =
  | 'kg'
  | 'lb'
  | 'm'
  | 'yd'
  | 'ft'
  | 'in'
  | 'cm'
  | 'sq.m'
  | 'sq.ft'
  | 'sq.in'
  | 'cu.m'
  | 'cu.ft'
  | 'cu.in'

export type ItemCollectionType =
  | 'set(s)'
  | 'piece(s)'
  | 'pack(s)'
  | 'carton(s)'
  | 'box(es)'
  | 'bottle(s)'
  | 'truck(s)'
  | 'container(s)'
  | 'dozen(s)'
  | 'wrap(s)'
  | 'roll(s)'

export default class UnitOfMeasurement extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: ItemCollectionType | UnitsOfMeasurement

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
