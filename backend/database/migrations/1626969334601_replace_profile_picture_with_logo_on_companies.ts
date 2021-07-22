import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Companies extends BaseSchema {
  protected tableName = 'companies'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('logo').unsigned().nullable().index().after('company_size_id')

      table.dropColumn('profile_picture')

      table.foreign('logo').references('uploaded_files.id').onDelete('SET NULL').onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign('logo')
      table.dropIndex('logo')
      table.dropColumn('logo')
      table.string('profile_picture')
    })
  }
}
