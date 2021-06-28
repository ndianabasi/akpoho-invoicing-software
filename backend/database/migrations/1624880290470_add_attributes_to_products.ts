import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('name').index()
      table.string('slug').index().unique()
      table.string('sku').index().unique()
      table.decimal('price', 15, 4).index()
      table.boolean('is_enabled').index().defaultTo(true)
      table
        .enum('visibility', ['Catalogue Only', 'Search Only', 'Catalogue and Search', 'Embedded'])
        .index()
      table
        .enum('stock_status', ['In Stock', 'Out of Stock', 'Made to Order', 'Drop-shipped'])
        .index()
      table.boolean('product_has_weight').defaultTo(true)
      table.text('description')
      table.text('short_description')
      table.integer('product_images').unsigned()
      table.decimal('weight', 15, 2)
      table.integer('country_of_manufacture').unsigned().index()
      table.dateTime('active_from')
      table.dateTime('active_to')
      table.text('meta_description')
      table.string('meta_keywords')
      table.string('meta_robots')
      table.string('meta_title')
      table.decimal('minimum_advertised_price', 15, 4)
      table.boolean('display_actual_price').defaultTo(false)
      table.dateTime('product_new_from_date')
      table.dateTime('product_new_to_date')
      table.string('seo_name').index()
      table.decimal('special_price', 15, 4).index()
      table.dateTime('special_price_from_date')
      table.dateTime('special_price_to_date')
      table.boolean('is_for_one_time_purchase').index().defaultTo(false)

      table
        .foreign('product_images')
        .references('uploaded_files.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table
        .foreign('country_of_manufacture')
        .references('countries.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)

    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique().index().notNullable()
      table.uuid('product_type_id').nullable().index()
      table.uuid('attribute_set_id').nullable().index()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table
        .foreign('product_type_id')
        .references('product_types.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table
        .foreign('attribute_set_id')
        .references('attribute_sets.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
    })
  }
}
