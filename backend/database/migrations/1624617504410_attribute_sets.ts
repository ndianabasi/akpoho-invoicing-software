import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AttributeSets extends BaseSchema {
  protected tableName = 'attribute_sets'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('sort_order').unsigned().notNullable().defaultTo(2).after('is_system')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('sort_order')
    })
  }
}
