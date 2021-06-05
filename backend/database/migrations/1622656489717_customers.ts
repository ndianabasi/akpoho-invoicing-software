import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Customers extends BaseSchema {
  protected tableName = 'customers'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['middle_name'])
      table.dropUnique(['email'])
      table.dropUnique(['phone_number'])
    })
  }

  public async down() {}
}
