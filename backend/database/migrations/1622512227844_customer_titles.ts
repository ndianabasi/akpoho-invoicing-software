import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CustomerTitles extends BaseSchema {
  protected tableName = 'customer_titles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
