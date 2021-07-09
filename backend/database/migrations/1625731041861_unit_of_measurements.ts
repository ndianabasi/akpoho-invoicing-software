import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UnitOfMeasurements extends BaseSchema {
  protected tableName = 'unit_of_measurements'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').index().primary().notNullable().unique()
      table.string('name').index().notNullable().unique()
      table.enum('type', ['collection', 'discrete']).notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
