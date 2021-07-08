import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AttributeAttributeGroup extends BaseSchema {
  protected tableName = 'attribute_attribute_group'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('sort_order').unsigned().after('type')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('sort_order')
    })
  }
}
