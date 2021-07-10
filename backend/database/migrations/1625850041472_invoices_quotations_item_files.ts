import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InvoicesQuotationsItemsFiles extends BaseSchema {
  protected tableName = 'invoices_quotations_items_files'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().unique().index().notNullable()
      table
        .uuid('invoices_quotations_item_id')
        .index('iqtf_invoices_quotations_item_id_idx')
        .notNullable()
      table.integer('uploaded_file_id').index('iqtf_uploaded_file_id_idx').notNullable().unsigned()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table
        .foreign('uploaded_file_id', 'iqtf_uploaded_file_id_for_idx')
        .references('uploaded_files.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .foreign('invoices_quotations_item_id', 'iqtf_invoices_quotations_item_id_for_idx')
        .references('invoice_quotation_items.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
