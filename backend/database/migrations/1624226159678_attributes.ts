import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Attributes extends BaseSchema {
  protected tableName = 'attributes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique().index().notNullable()
      table.string('name').index().notNullable().comment('The name of the attribute')
      table
        .string('attribute_code')
        .index()
        .notNullable()
        .comment(
          'The attribute code is used internally for easy and accurate referencing of attributes on the backend'
        )
      table
        .uuid('field_input_type_id')
        .index()
        .nullable()
        .comment('Set the field input type e.g. toggle, multi-select, text, textarea, etc.')
      table
        .boolean('is_system_attribute')
        .index()
        .defaultTo(false)
        .comment(
          'Indicate the attribute as a system attribute and limits the extend to which it can be edited and visibility.'
        )
      table
        .string('default_value')
        .nullable()
        .comment('Sets the default value of the attribute when it is omitted.')
      table
        .uuid('field_input_validation_type_id')
        .nullable()
        .comment('Set the input validation type for the attribute.')
      table.boolean('required').index().defaultTo(false)
      table
        .boolean('visibility')
        .index()
        .defaultTo(true)
        .comment(
          'Indicate if the attribute will be visible for use. For example, when creating attribute sets.'
        )
      table.boolean('unique_value').defaultTo(false)
      table
        .boolean('show_on_product_grid')
        .defaultTo(false)
        .comment('Allow the attribute to be available for display as a column on the product grid')
      table
        .boolean('use_for_product_filter')
        .defaultTo(false)
        .comment('Allow the attribute to be used for filtering on the backend')
      table
        .boolean('use_for_product_search')
        .defaultTo(false)
        .comment('Allow the attribute to the used for searching on the frontend')
      table
        .boolean('use_for_product_sorting')
        .defaultTo(false)
        .comment('Allow the attribute to be used for product sorting on the backend')
      table
        .boolean('use_for_product_listing')
        .defaultTo(false)
        .comment(
          'Allow the attribute to be used for product listing ordering/sorting on the frontend'
        )

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table
        .foreign('field_input_type_id')
        .references('field_input_types.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
      table
        .foreign('field_input_validation_type_id')
        .references('field_input_validation_types.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
