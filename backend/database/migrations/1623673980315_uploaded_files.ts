import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UploadedFiles extends BaseSchema {
  protected tableName = 'uploaded_files'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().unique()
      table.string('company_id').index()
      table.string('name').index().notNullable()
      table.string('alternative_text').index()
      table.string('caption').index()
      table.integer('width').index().unsigned()
      table.integer('height').index().unsigned()
      table.json('formats').nullable()
      table.string('hash').index().notNullable()
      table.string('ext').index().notNullable()
      table.string('mime').notNullable()
      table.decimal('size', 15, 2).notNullable()
      table.string('url').notNullable()
      table.string('preview_url')
      table.integer('file_provider_id').unsigned().index().notNullable()
      table.json('file_provider_metadata')
      table.string('created_by').index().nullable()
      table.string('updated_by')
      table.timestamps(true)

      table.foreign('company_id').references('companies.id').onUpdate('CASCADE').onDelete('CASCADE')
      table
        .foreign('file_provider_id')
        .references('file_providers.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.foreign('created_by').references('users.id').onUpdate('CASCADE').onDelete('SET NULL')
      table.foreign('updated_by').references('users.id').onUpdate('CASCADE').onDelete('SET NULL')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
