import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AttributeCompanies extends BaseSchema {
  protected tableName = 'attribute_company'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('attribute_id').index().notNullable()
      table.uuid('company_id').index().notNullable()
      table.enum('ownership', ['owner', 'consumer']).index().notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table
        .foreign('attribute_id')
        .references('attributes.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.foreign('company_id').references('companies.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
