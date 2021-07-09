import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { InvoiceQuotationTypes } from 'App/Helpers/utils'

export default class InvoicesQuotations extends BaseSchema {
  protected tableName = 'invoices_quotations'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.enum('type', InvoiceQuotationTypes).index().notNullable().after('product_id')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('type')
    })
  }
}
