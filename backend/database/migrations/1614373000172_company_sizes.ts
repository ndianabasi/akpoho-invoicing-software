import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CompanySizes extends BaseSchema {
  protected tableName = 'company_sizes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').index().unique().primary().notNullable()
      table.string('size').notNullable().index().unique()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
