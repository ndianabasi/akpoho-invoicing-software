import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CustomerAddresses extends BaseSchema {
  protected tableName = 'customer_addresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().index().unique().notNullable()
      table.uuid('customer_id').index().notNullable()

      table.string('street_address').notNullable()
      table.string('city', 50).nullable()
      table.string('postal_code', 10).nullable()
      table.integer('state').unsigned().nullable()
      table.integer('country').unsigned().nullable()

      table.enum('address_type', ['billing_address', 'shipping_address']).notNullable()
      table.timestamps(true)

      table
        .foreign('customer_id')
        .references('customers.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
