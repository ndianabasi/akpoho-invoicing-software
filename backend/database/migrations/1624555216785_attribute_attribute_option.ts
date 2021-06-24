import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AttributeAttributeOptions extends BaseSchema {
  protected tableName = 'attribute_attribute_option'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('attribute_id').notNullable().index()
      table.uuid('attribute_option_id').notNullable().index()
      table.integer('sort_order').unsigned()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table
        .foreign('attribute_id')
        .references('attributes.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .foreign('attribute_option_id')
        .references('attribute_options.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
