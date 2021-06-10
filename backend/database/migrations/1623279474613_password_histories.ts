import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PasswordHistories extends BaseSchema {
  protected tableName = 'password_histories'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').unique().index().notNullable()
      table.uuid('user_id').index().notNullable()
      table.string('old_password').notNullable()
      table.timestamps()

      table.foreign('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
