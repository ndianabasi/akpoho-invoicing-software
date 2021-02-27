import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Countries extends BaseSchema {
  protected tableName = 'countries'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').index().unique().notNullable()
      table.string('name', 255).notNullable().index()
      table.string('capital', 255).nullable()
      table.string('citizenship', 255).nullable().index()
      table.string('numeric_code', 10).nullable().unique().index()
      table.string('country_code', 10).nullable().index()
      table.string('currency', 255).nullable()
      table.string('currency_code', 255).nullable().index()
      table.string('currency_sub_unit', 255).nullable()
      table.string('currency_symbol', 255).nullable()
      table.integer('currency_decimals').nullable()
      table.string('full_name', 255).nullable().index()
      table.string('iso_3166_2', 10).nullable()
      table.string('iso_3166_3', 10).nullable()
      table.string('region_code', 10).nullable()
      table.string('sub_region_code', 3).nullable()
      table.boolean('eea').nullable()
      table.string('calling_code', 10).nullable()
      table.string('flag', 255).nullable()
      table.timestamps(true)

      table.index(['id', 'name', 'numeric_code', 'citizenship'], 'countries_full_index')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
