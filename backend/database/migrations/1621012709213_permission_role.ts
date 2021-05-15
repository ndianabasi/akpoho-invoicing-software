import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PermissionRole extends BaseSchema {
  protected tableName = 'permission_role'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().unique().primary().index()
      table.uuid('role_id').notNullable().index()
      table.uuid('permission_id').notNullable().index()
      table.timestamps(true)

      table.foreign('role_id').references('roles.id').onDelete('CASCADE').onUpdate('CASCADE')
      table
        .foreign('permission_id')
        .references('permissions.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
