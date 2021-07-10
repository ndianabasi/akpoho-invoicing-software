import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InvoiceQuotationItems extends BaseSchema {
  protected tableName = 'invoice_quotation_items'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('sort_order').after('description').notNullable().index().unsigned()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('sort_order')
    })
  }
}
