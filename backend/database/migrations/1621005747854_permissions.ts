import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Permissions extends BaseSchema {
  protected tableName = 'permissions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().index().notNullable().unique()
      table.string('name', 30).notNullable().unique().index()
      table.text('description').nullable()
      table.timestamps(true)

      table.index(['id', 'name'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
