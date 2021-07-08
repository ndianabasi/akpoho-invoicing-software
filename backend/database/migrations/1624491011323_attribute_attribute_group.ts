import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AttributeAttributeGroups extends BaseSchema {
  protected tableName = 'attribute_attribute_group'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('attribute_id').notNullable().index()
      table.uuid('attribute_group_id').notNullable().index()
      table.enum('type', ['product', 'category'])

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table
        .foreign('attribute_id')
        .references('attributes.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .foreign('attribute_group_id')
        .references('attribute_groups.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
