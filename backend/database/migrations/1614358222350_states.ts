import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class States extends BaseSchema {
  protected tableName = 'states'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').index()
      table.string('name').notNullable().index()
      table.string('capital').index()
      table.string('code').nullable()
      table.string('country_numeric_code').index()
      table.integer('country_id').unsigned().notNullable().index()

      table.timestamps(true)

      table.foreign('country_id').references('countries.id').onDelete('cascade')

      table
        .foreign('country_numeric_code')
        .references('countries.numeric_code')
        .onDelete('cascade')
        .onUpdate('cascade')

      table.index(['id', 'name', 'code', 'country_id'], 'states_full_index')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
