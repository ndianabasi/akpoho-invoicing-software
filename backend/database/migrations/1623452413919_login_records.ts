import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class LoginRecords extends BaseSchema {
  protected tableName = 'login_records'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().index()
      table.uuid('user_id').index()
      table.dateTime('timestamp').index()
      table.string('ip_address').nullable().index()
      table.string('location').nullable().index()

      table.index(['id', 'user_id'])

      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
