import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Customers extends BaseSchema {
  protected tableName = 'customers'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('company_state_id')
      table.dropForeign('company_country_id')
      table.dropIndex('company_state_id')
      table.dropIndex('company_country_id')

      table.dropColumns(
        ...[
          'company_street_address',
          'company_city',
          'company_postal_code',
          'company_state_id',
          'company_country_id',
        ]
      )
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('company_street_address').nullable()
      table.string('company_city', 50).nullable()
      table.string('company_postal_code', 10).nullable()
      table.integer('company_state_id').unsigned().nullable().index()
      table.integer('company_country_id').unsigned().nullable().index()

      table
        .foreign('company_state_id')
        .references('states.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table
        .foreign('company_country_id')
        .references('countries.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
    })
  }
}
