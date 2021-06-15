import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserProfiles extends BaseSchema {
  protected tableName = 'user_profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().index().unique().notNullable()
      table.uuid('user_id').index().unique().nullable()

      table.string('first_name', 50).notNullable().index()
      table.string('middle_name', 50).unique().nullable().index()
      table.string('last_name', 50).notNullable().index()

      table.string('phone_number', 30).unique().nullable()
      table.string('address').nullable()
      table.string('city', 50).nullable()
      table.integer('state_id').unsigned().nullable()
      table.integer('country_id').unsigned().nullable()

      table.integer('profile_picture').unsigned().index().nullable()

      table.timestamps(true)

      table.foreign('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE')

      table.foreign('state_id').references('states.id').onDelete('SET NULL').onUpdate('CASCADE')

      table
        .foreign('country_id')
        .references('countries.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table
        .foreign('profile_picture')
        .references('uploaded_files.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
