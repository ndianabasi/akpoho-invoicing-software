import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FileProviders extends BaseSchema {
  protected tableName = 'file_providers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').index().unique()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
