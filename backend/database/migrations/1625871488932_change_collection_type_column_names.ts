import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InvoiceQuotationItems extends BaseSchema {
  protected tableName = 'invoice_quotation_items'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('collection_type', 'collection_type_id')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('collection_type_id', 'collection_type')
    })
  }
}
