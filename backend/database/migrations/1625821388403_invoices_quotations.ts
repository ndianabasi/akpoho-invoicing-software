import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { discountTypes, roundingTypes, thousandSeparatorTypes } from 'App/Helpers/utils'

export default class Quotations extends BaseSchema {
  protected tableName = 'invoices_quotations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique().index().notNullable()
      table.uuid('customer_id').index().notNullable()
      // company_id added here in subsequent migration
      table.uuid('product_id').index().notNullable() // dropped
      table.uuid('customer_shipping_address').nullable()
      table.uuid('customer_billing_address').nullable()
      table.dateTime('date').index().notNullable()
      table.string('code', 20).index().nullable()
      table.string('title', 100).index().notNullable()
      table.text('introduction').nullable()
      table.text('notes').nullable()
      table.json('additional_fees').nullable()
      table.boolean('simple_quantities')
      table.boolean('amounts_are_tax_inclusive')
      table.decimal('tax_percentage', 15, 6).nullable()
      table.boolean('round_amounts')
      table.enum('round_amount_type', roundingTypes)
      table.boolean('show_discounts')
      table.enum('discount_type', discountTypes)
      table.boolean('set_discount_type_per_line')
      table.boolean('calculate_totals')
      table.boolean('change_product_prices')
      table.integer('number_of_decimals').unsigned()
      table.boolean('use_thousand_separator')
      table.enum('thousand_separator_type', thousandSeparatorTypes)
      table.boolean('show_additional_subtotal_discount')
      table.enum('additional_discount_type', discountTypes)
      table.decimal('additional_discount_amount', 15, 6).unsigned()
      table.boolean('show_additional_fees')
      table.boolean('show_images')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table
        .foreign('customer_id')
        .references('customers.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.foreign('product_id').references('products.id').onDelete('CASCADE').onUpdate('CASCADE')
      table
        .foreign('customer_shipping_address')
        .references('customer_addresses.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
      table
        .foreign('customer_billing_address')
        .references('customer_addresses.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
