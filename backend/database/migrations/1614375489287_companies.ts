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
      table.integer('state').unsigned().nullable()
      table.integer('country').unsigned().nullable()
      table.string('slug', 255).notNullable().index()
      table.integer('size').nullable().index().unsigned()
      table.string('profile_picture').nullable()
      table.string('website', 50).nullable()
      table.timestamp('approved_at').nullable()
      table.uuid('approved_by').nullable()
      table.timestamps(true)

      table.foreign('approved_by').references('users.id').onDelete('SET NULL').onUpdate('CASCADE')
      table.foreign('state').references('states.id').onDelete('SET NULL').onUpdate('CASCADE')
      table.foreign('country').references('countries.id').onDelete('SET NULL').onUpdate('CASCADE')
      table.foreign('size').references('company_sizes.id').onDelete('RESTRICT').onUpdate('CASCADE')

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
