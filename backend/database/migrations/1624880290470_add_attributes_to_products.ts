import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('name').index().notNullable()
      table.string('slug').index().unique().notNullable()
      table.string('sku').index().unique()
      table.decimal('price', 15, 4).index().notNullable()
      table.boolean('is_enabled').index().defaultTo(true)
      table
        .enum('visibility', ['Catalogue Only', 'Search Only', 'Catalogue and Search', 'Embedded'])
        .defaultTo('Catalogue and Search')
        .notNullable()
        .index()
      table
        .enum('stock_status', ['In Stock', 'Out of Stock', 'Made to Order', 'Drop-shipped'])
        .index()
        .defaultTo('In Stock')
        .notNullable()
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
    this.schema.table(this.tableName, (table) => {
      table.dropForeign('product_images')
      table.dropForeign('country_of_manufacture')
      table.dropColumns(
        'name',
        'slug',
        'sku',
        'price',
        'is_enabled',
        'visibility',
        'stock_status',
        'product_has_weight',
        'description',
        'short_description',
        'product_images',
        'weight',
        'country_of_manufacture',
        'active_from',
        'active_to',
        'meta_description',
        'meta_keywords',
        'meta_robots',
        'meta_title',
        'minimum_advertised_price',
        'display_actual_price',
        'product_new_from_date',
        'product_new_to_date',
        'seo_name',
        'special_price',
        'special_price_from_date',
        'special_price_to_date',
        'is_for_one_time_purchase'
      )
    })
  }
}
