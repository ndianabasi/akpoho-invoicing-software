import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AttributeSets extends BaseSchema {
  protected tableName = 'attribute_sets'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_system').defaultTo(false).index().after('name')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex('is_system')
      table.dropColumn('is_system')
    })
  }
}
