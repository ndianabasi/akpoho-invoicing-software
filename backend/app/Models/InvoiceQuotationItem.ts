import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeSave,
  belongsTo,
  BelongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import UUIDHook from './Hooks/UUIDHook'
import InvoiceQuotation, { DiscountType } from './InvoiceQuotation'
import Product from './Product'
import UnitOfMeasurement from './UnitOfMeasurement'
import UploadedFile from './UploadedFile'

export default class InvoiceQuotationItem extends BaseModel {
  public static selfAssignPrimaryKey = true
  public static table = 'invoice_quotation_items'

  @column({ isPrimary: true })
  public id: string

  @column()
  public invoicesQuotationsId: string

  @column()
  public productId: string

  @column()
  public productName: string

  @column()
  public description: string

  @column()
  public qty: number

  @column()
  public unitOfMeasurementId: number

  @column()
  public collectionTypeId: number

  @column()
  public groupQty: number

  @column()
  public unitPrice: number

  @column()
  public unitDiscount: number

  @column()
  public discountType: DiscountType

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static generateUUID(model: InvoiceQuotationItem) {
    UUIDHook.generateUUID(model, 'id')
  }

  @belongsTo(() => InvoiceQuotation, { foreignKey: 'invoicesQuotationsId' })
  public invoiceQuotation: BelongsTo<typeof InvoiceQuotation>

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>

  @belongsTo(() => UnitOfMeasurement, { foreignKey: 'unitOfMeasurementId' })
  public unitofMeasurement: BelongsTo<typeof UnitOfMeasurement>

  @belongsTo(() => UnitOfMeasurement, { foreignKey: 'collectionTypeId' })
  public collectionType: BelongsTo<typeof UnitOfMeasurement>

  @manyToMany(() => UploadedFile, {
    pivotTable: 'invoices_quotations_items_files',
    pivotTimestamps: true,
    pivotForeignKey: 'invoicesQuotationsItemId',
    pivotRelatedForeignKey: 'uploadedFileId',
  })
  public files: ManyToMany<typeof UploadedFile>
}
