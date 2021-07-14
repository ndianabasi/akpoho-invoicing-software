import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InvoiceQuotationItems extends BaseSchema {
  protected tableName = 'invoice_quotation_items'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('custom_serial_number', 3).after('product_id')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('custom_serial_number')
    })
  }
}
