import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InvoicesQuotations extends BaseSchema {
  protected tableName = 'invoices_quotations'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.boolean('use_custom_serial_numbers').defaultTo(false).after('show_images')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('use_custom_serial_numbers')
    })
  }
}
