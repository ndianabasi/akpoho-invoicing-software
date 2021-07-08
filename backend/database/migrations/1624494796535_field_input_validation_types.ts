import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FieldInputValidationTypes extends BaseSchema {
  protected tableName = 'field_input_validation_types'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('regex').nullable().after('code')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('regex')
    })
  }
}
