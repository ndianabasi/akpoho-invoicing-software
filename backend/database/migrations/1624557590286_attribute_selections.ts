import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AttributeSelections extends BaseSchema {
  protected tableName = 'attribute_selections'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('attribute_id').index().notNullable()
      table.uuid('attribute_option_id').index().notNullable()

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
