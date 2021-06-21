import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Attributes extends BaseSchema {
  protected tableName = 'field_input_validation_types'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique().index().notNullable()
      table.string('name').index().notNullable()
      table
        .string('code')
        .index()
        .notNullable()
        .comment('The validation code used for referencing the validation type')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
