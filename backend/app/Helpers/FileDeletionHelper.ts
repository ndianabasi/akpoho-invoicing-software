'use strict'

import path from 'path'
import fs from 'fs/promises'
import UploadedFile, { FormatAttributes } from 'App/Models/UploadedFile'

class FileDeletionHelper {
  protected uploadDir: string
  protected provider: string
  protected UPLOAD_DIR_PREFIX = 'public'
  protected fileIds: number[]

  /**
   *
   * @param fileData {FileData} The data of the attached file(s)
   * @param uploadDir {string} The upload directory
   */
  constructor(fileIds: number[] | number) {
    this.fileIds = Array.isArray(fileIds) ? fileIds : [fileIds]
  }

  private async getFileModels() {
    const models = [] as UploadedFile[]

    for (let i = 0; i < this.fileIds.length; i++) {
      const fileId = this.fileIds[i]
      const fileModel = await UploadedFile.find(fileId)
      if (fileModel) models.push(fileModel)
    }

    return models
  }

  private getFilePath(relativePath: string) {
    return path.join(process.cwd(), relativePath)
  }

  public async delete() {
    const fileModels = await this.getFileModels()

    for (let i = 0; i < fileModels.length; i++) {
      const fileModel = fileModels[i]

      const fileUrl = fileModel.url
      const fileFormats = fileModel.formats as Record<string, FormatAttributes>
      await fileModel.load('provider')
      const fileProvider = fileModel.provider

      if (fileProvider.name === 'local') {
        // local file system deletion
        // 1. Delete original file
        const originalFilePath = this.getFilePath(`${this.UPLOAD_DIR_PREFIX}/${fileUrl}`)
        await fs.unlink(originalFilePath)

        // 2. Delete each file format
        for (let i = 0; i < Object.keys(fileFormats).length; i++) {
          const format = Object.values(fileFormats)[i]
          const formatPath = this.getFilePath(`${this.UPLOAD_DIR_PREFIX}/${format.url}`)
          await fs.unlink(formatPath)
        }
      }

      // Delete the model
      await fileModel.delete()
    }
  }
}

export default FileDeletionHelper
