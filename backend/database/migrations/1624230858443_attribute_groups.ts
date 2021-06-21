import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AttributeGroups extends BaseSchema {
  protected tableName = 'attribute_groups'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique().index().notNullable()
      table.string('name').index().notNullable()
      table.uuid('attribute_set_id').index().notNullable()
      table.integer('sort_order').notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table
        .foreign('attribute_set_id')
        .references('attribute_sets.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
