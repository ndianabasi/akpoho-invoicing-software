import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
  protected tableName = 'products'

  public async up() {
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

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
