import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductTypes extends BaseSchema {
  protected tableName = 'product_types'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('sort_order').unsigned().notNullable().after('name')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('sort_order')
    })
  }
}
