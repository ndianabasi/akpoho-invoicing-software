import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UploadedFiles extends BaseSchema {
  protected tableName = 'uploaded_files'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table
        .enum('usage_type', [
          'user_profile_picture',
          'company_logo',
          'customer_logo',
          'product_gallery_image',
          'category_header_image',
          'invoice_quotation_image',
        ])
        .after('name')
        .notNullable()
        .index()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('usage_type')
    })
  }
}
