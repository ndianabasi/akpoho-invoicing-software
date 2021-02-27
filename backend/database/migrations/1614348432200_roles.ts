import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Roles extends BaseSchema {
  protected tableName = 'roles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().index().notNullable().unique()
      table.string('name', 20).notNullable().unique().index()
      table.text('description').nullable()
      table.timestamps(true)

      table.index(['id', 'name'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
