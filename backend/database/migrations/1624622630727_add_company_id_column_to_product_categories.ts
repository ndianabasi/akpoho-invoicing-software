import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductCategories extends BaseSchema {
  protected tableName = 'product_categories'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.uuid('company_id').index().after('id')

      table.foreign('company_id').references('companies.id').onDelete('CASCADE').onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign('company_id')
      table.dropIndex('company_id')
      table.dropColumn('company_id')
    })
  }
}
