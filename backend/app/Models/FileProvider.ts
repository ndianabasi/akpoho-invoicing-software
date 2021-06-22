import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import UploadedFile from './UploadedFile'

export default class FileProvider extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @hasMany(() => UploadedFile)
  public uploadedFiles: HasMany<typeof UploadedFile>
}
