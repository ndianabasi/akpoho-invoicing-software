import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CustomerGroups extends BaseSchema {
  protected tableName = 'customer_groups'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique().index().notNullable()
      table.string('name').index().notNullable()
      table
        .uuid('tax_class_id')
        .index()
        .nullable()
        .comment(
          'References the `customer_tax_class_id` attribute code from the `attributes` table'
        )

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table
        .foreign('tax_class_id')
        .references('attributes.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
