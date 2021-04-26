import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Customers extends BaseSchema {
  protected tableName = 'customers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().index().unique().notNullable()
      table.uuid('company_id').index().notNullable()

      table.string('first_name', 50).notNullable().index()
      table.string('middle_name', 50).unique().nullable().index()
      table.string('last_name', 50).notNullable().index()

      table.string('email', 50).unique().nullable()
      table.string('phone_number', 30).unique().nullable()

      table.timestamps(true)

      table.foreign('company_id').references('companies.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
