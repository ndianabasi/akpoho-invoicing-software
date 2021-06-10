import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PasswordChanges extends BaseSchema {
  protected tableName = 'password_changes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').unique().index().notNullable()
      table.uuid('user_id').unique().index().notNullable()
      table.string('new_password').nullable()
      table.integer('verification_code').nullable().unsigned()
      table.timestamp('verification_code_expires_at').nullable()
      table.uuid('secret').nullable()
      table.timestamps()

      table.foreign('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
