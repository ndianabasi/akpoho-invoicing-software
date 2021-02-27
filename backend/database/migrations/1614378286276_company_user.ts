import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CompanyUsers extends BaseSchema {
  protected tableName = 'company_user'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().unique().primary().index()
      table.uuid('company_id').notNullable().index()
      table.uuid('user_id').notNullable().index()
      table.timestamps(true)

      table.foreign('company_id').references('companies.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.foreign('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
