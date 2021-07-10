import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.decimal('price', 15, 6).notNullable().alter()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.decimal('price', 15, 4).notNullable().alter()
    })
  }
}
