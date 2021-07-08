import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductTypes extends BaseSchema {
  protected tableName = 'product_types'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.boolean('is_active').index().after('name').defaultTo(false)
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('is_active')
    })
  }
}
