import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Customers extends BaseSchema {
  protected tableName = 'customers'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('customer_title_id').nullable().after('last_name').unsigned()
      table.string('first_name', 50).nullable().alter()
      table.string('last_name', 50).nullable().alter()

      table
        .foreign('customer_title_id')
        .references('customer_titles.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('customer_title_id')
      table.dropColumn('customer_title_id')

      table.string('first_name', 50).notNullable().alter()
      table.string('last_name', 50).notNullable().alter()
    })
  }
}
