import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductProductCategories extends BaseSchema {
  protected tableName = 'product_product_category'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('product_id').notNullable().index()
      table.uuid('product_category_id').notNullable().index()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('product_id').references('products.id').onDelete('CASCADE').onUpdate('CASCADE')
      table
        .foreign('product_category_id')
        .references('product_categories.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
