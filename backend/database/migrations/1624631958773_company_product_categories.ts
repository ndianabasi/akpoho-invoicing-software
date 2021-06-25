import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CompanyProductCategories extends BaseSchema {
  protected tableName = 'company_product_category'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('product_category_id').index().notNullable()
      table.uuid('company_id').index().notNullable()
      table.enum('ownership', ['owner', 'consumer']).index().notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table
        .foreign('product_category_id')
        .references('product_categories.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.foreign('company_id').references('companies.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
