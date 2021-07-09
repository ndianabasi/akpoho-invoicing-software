import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { discountTypes } from 'App/Helpers/utils'

export default class InvoiceQuotationItems extends BaseSchema {
  protected tableName = 'invoice_quotation_items'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().index().unique().notNullable()
      table.uuid('invoices_quotations_id').index().notNullable()
      table.uuid('product_id').index().nullable()
      table.string('product_name').index().nullable()
      table.text('description').nullable()
      table.decimal('qty', 15, 6).notNullable().index()
      table.integer('unit_of_measurement_id').index().nullable().unsigned()
      table.integer('collection_type').index().unsigned()
      table.decimal('group_qty', 15, 6)
      table.decimal('unit_price', 15, 6).notNullable().index()
      table.decimal('unit_discount', 15, 6)
      table.enum('discount_type', discountTypes)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table
        .foreign('invoices_quotations_id')
        .references('invoices_quotations.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.foreign('product_id').references('products.id').onDelete('SET NULL').onUpdate('CASCADE')
      table
        .foreign('unit_of_measurement_id')
        .references('unit_of_measurements.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
      table
        .foreign('collection_type')
        .references('unit_of_measurements.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
