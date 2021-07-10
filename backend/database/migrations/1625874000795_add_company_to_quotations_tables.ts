import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InvoicesQuotations extends BaseSchema {
  protected tableName = 'invoices_quotations'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.uuid('company_id').notNullable().index().after('customer_id')

      table.foreign('company_id').references('companies.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign('company_id')
      table.dropIndex('company_id')
      table.dropColumn('company_id')
    })
  }
}
