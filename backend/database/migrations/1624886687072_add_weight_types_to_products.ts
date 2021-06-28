import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.enum('weight_unit', ['kg', 'lb']).defaultTo('kg').after('weight')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('weight_unit')
    })
  }
}
