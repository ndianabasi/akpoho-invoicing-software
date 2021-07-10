import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InvoicesQuotations extends BaseSchema {
  protected tableName = 'invoices_quotations'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign('product_id')
      table.dropIndex('product_id')
      table.dropColumn('product_id')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.uuid('product_id').index().notNullable().after('customer_id')
      table.foreign('product_id').references('products.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
  }
}
