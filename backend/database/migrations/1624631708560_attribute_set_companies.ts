import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AttributeSetCompanies extends BaseSchema {
  protected tableName = 'attribute_set_company'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('attribute_set_id').index().notNullable()
      table.uuid('company_id').index().notNullable()
      table.enum('ownership', ['owner', 'consumer']).index().notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table
        .foreign('attribute_set_id')
        .references('attribute_sets.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.foreign('company_id').references('companies.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
