import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AttributeGroups extends BaseSchema {
  protected tableName = 'attribute_groups'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_system').defaultTo(false).index().after('name')
      table.integer('sort_order').notNullable().unsigned().alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex('is_system')
      table.dropColumn('is_system')
      table.integer('sort_order').notNullable().alter()
    })
  }
}
