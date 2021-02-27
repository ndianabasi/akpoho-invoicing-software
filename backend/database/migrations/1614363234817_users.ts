import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().index().unique().notNullable()
      table.string('email', 254).nullable().unique().index()
      table.string('password', 60).nullable()
      table.uuid('role_id').nullable().index()
      table.integer('login_code', 6).nullable().index().unsigned()
      table.string('activation_code').nullable().index().unique()
      table.integer('forgot_password_code', 6).nullable().index().unsigned()
      table.boolean('login_status').defaultTo(0)
      table.boolean('is_account_activated').defaultTo(0)
      table.boolean('is_email_verified').defaultTo(0)
      table.integer('lifetime_login').defaultTo(0).unsigned()
      table.boolean('password_change_required').defaultTo(0)
      table.boolean('remember_token').defaultTo(0)
      table.timestamp('last_login_time').nullable()
      table.timestamp('account_activated_at').nullable()
      table.timestamp('email_verified_at').nullable()
      table.timestamp('forgot_password_code_expires_at').nullable()
      table.timestamp('activation_code_expires_at').nullable()
      table.timestamp('login_code_expires_at').nullable()
      table.timestamp('password_last_changed_at').nullable()
      table.uuid('password_change_secret').nullable().index()
      table.timestamps(true)

      table.index(
        ['id', 'email', 'role_id', 'login_status', 'is_email_verified', 'is_account_activated'],
        'users_full_index'
      )

      table.foreign('role_id').references('roles.id').onDelete('SET NULL').onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
