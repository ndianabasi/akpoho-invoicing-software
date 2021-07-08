import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Attributes extends BaseSchema {
  protected tableName = 'attributes'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .boolean('use_for_layered_navigation')
        .defaultTo(false)
        .after('use_for_product_listing')
        .comment('Allow attribute to be used for layered navigation on the frontend')
      table
        .boolean('comparable')
        .defaultTo(false)
        .after('use_for_layered_navigation')
        .comment('Allow attribute to be used for searching on the frontend')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('use_for_layered_navigation')
      table.dropColumn('comparable')
    })
  }
}
