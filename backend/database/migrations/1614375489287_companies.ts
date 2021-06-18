import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Companies extends BaseSchema {
  protected tableName = 'companies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().index().unique().notNullable()
      table.string('name', 50).unique().notNullable().index()
      table.string('email', 50).unique().notNullable().index()
      table.string('phone_number', 30).unique().nullable()
      table.boolean('is_approved').defaultTo(0)
      table.string('address').nullable()
      table.string('city', 50).nullable()
      table.integer('state_id').unsigned().nullable()
      table.integer('country_id').unsigned().nullable()
      table.string('slug', 255).notNullable().index()
      table.integer('company_size_id').nullable().index().unsigned()
      table.string('profile_picture').nullable()
      table.string('website', 50).nullable()
      table.timestamp('approved_at').nullable()
      table.uuid('approved_by').nullable()
      table.timestamps(true)

      table.foreign('approved_by').references('users.id').onDelete('SET NULL').onUpdate('CASCADE')
      table.foreign('state_id').references('states.id').onDelete('SET NULL').onUpdate('CASCADE')
      table
        .foreign('country_id')
        .references('countries.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
      table
        .foreign('company_size_id')
        .references('company_sizes.id')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table.index(
        ['id', 'name', 'email', 'phone_number', 'address', 'city', 'country', 'slug'],
        'companies_full_index'
      )
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
