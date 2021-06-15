'use strict'

import path from 'path'
import crypto from 'crypto'
import _ from 'lodash'
import { bytesToKbytes, nameToSlug } from 'App/Helpers/utils'
import {
  generateResponsiveFormats,
  getFileBuffer,
  uploadSettings,
  canBeProcessed,
  getDimensions,
  THUMBNAIL_RESIZE_OPTIONS,
  resizeTo,
  getMetadatas,
} from 'App/Helpers/ImageManipulationHelper'
import {
  AttachedFile,
  FileData,
  FileInfo,
  FileMetaInfo,
  OptimizedOutput,
  EnhancedFileInfo,
} from './types/file'

import sharp from 'sharp'
import HttpContext, { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import createDirectory from './CreateDirectory'
import FileProvider from 'App/Models/FileProvider'
import UploadedFile from 'App/Models/UploadedFile'

class FileUploadHelper {
  protected requestedUser: HttpContextContract['requestedUser']
  protected requestedCompany: HttpContextContract['requestedCompany']
  protected fileData: FileData
  protected uploadDir: string
  protected provider: string
  protected uploadedFileModel: UploadedFile | undefined | null

  /**
   *
   * @param fileData {FileData} The data of the attached file(s)
   * @param uploadDir {string} The upload directory
   */
  public constructor(fileData: FileData, uploadDir: string, provider: string) {
    const { requestedUser, requestedCompany } = this.getContext
    this.requestedUser = requestedUser
    this.requestedCompany = requestedCompany

    this.fileData = fileData
    this.uploadDir = uploadDir
    this.provider = provider
  }

  get getContext() {
    const ctx = HttpContext.get()
    const { requestedUser, requestedCompany }: HttpContextContract = ctx!
    return { requestedUser, requestedCompany }
  }

  private randomSuffix = () => crypto.randomBytes(8).toString('hex')

  private generateFileName = (name: string) => {
    const baseName = nameToSlug(name, { replacement: '_' })
    return `${baseName}_${this.randomSuffix()}`
  }

  public formatFileInfo = (
    enhancedInfo: EnhancedFileInfo,
    fileInfo: FileInfo,
    metas: FileMetaInfo
  ) => {
    const { filename, type, size } = enhancedInfo
    const ext = path.extname(filename)
    const basename = path.basename(fileInfo.name || filename, ext)

    const usedName = fileInfo.name || filename

    const entity: FileInfo = {
      name: usedName,
      alternativeText: fileInfo.alternativeText,
      caption: fileInfo.caption,
      hash: this.generateFileName(basename),
      ext: fileInfo.ext,
      mime: fileInfo.mime,
      size: bytesToKbytes(size),
      width: fileInfo.width,
      height: fileInfo.height,
    }

    if (metas) {
      const { refId, ref, source, field } = metas

      if (refId && ref && field) {
        entity.related = [
          {
            refId,
            ref,
            source,
            field,
          },
        ]
      }

      if (metas.path) {
        entity.path = metas.path
      }
    }

    return entity
  }

  public enhanceFile = async (file: AttachedFile, fileInfo: FileInfo, metas?: FileMetaInfo) => {
    const readBuffer = await getFileBuffer(file.filePath!)

    const { buffer, info } = await this.optimize(readBuffer)

    const formattedFile = this.formatFileInfo(
      {
        filename: file.filePath!,
        type: file.type!,
        size: file.size,
      },
      fileInfo,
      metas ? metas : null
    )

    return _.assign(formattedFile, info, {
      buffer,
    })
  }

  public optimize = async (buffer: Buffer): Promise<OptimizedOutput> => {
    if (!uploadSettings.sizeOptimization || !(await canBeProcessed(buffer))) {
      return { buffer }
    }

    const sharpInstance = uploadSettings.autoOrientation ? sharp(buffer).rotate() : sharp(buffer)

    return sharpInstance
      .toBuffer({ resolveWithObject: true })
      .then(({ data, info }) => {
        const output = buffer.length < data.length ? buffer : data

        return {
          buffer: output,
          info: {
            width: info.width,
            height: info.height,
            size: bytesToKbytes(output.length),
          },
        }
      })
      .catch(() => ({ buffer }))
  }

  public async upload(): Promise<UploadedFile | null | undefined> {
    const { data, files } = this.fileData
    const { fileInfo, metas } = data

    const fileArray = Array.isArray(files) ? files : [files]
    const fileInfoArray = Array.isArray(fileInfo) ? fileInfo : [fileInfo]

    const doUpload = async (file: AttachedFile, fileInfo: FileInfo) => {
      const data = await this.enhanceFile(file, fileInfo, metas)

      return this.uploadFileAndPersist(data)
    }

    await Promise.all(
      fileArray.map((file: AttachedFile, idx: number) => doUpload(file, fileInfoArray[idx] || {}))
    )

    return this.uploadedFileModel
  }

  public async uploadFileAndPersist(file: FileInfo) {
    //console.log(data.buffer)
    let uploadedFileModel: UploadedFile | null | undefined = null

    const finalDir = `public/${this.uploadDir}`
    await createDirectory(finalDir).then(async () => {
      sharp(file.buffer!)
        .png()
        .toFile(`${finalDir}/${file.name}`)
        .then((info) => console.log(info))
        .catch((error) => console.log(error))

      // Generate and upload thumbnails
      const thumbnailFile = await this.generateThumbnail(file)
      if (thumbnailFile) {
        // Store thumbnailFile to filesystem
        sharp(thumbnailFile.buffer!)
          .jpeg()
          .toFile(`${finalDir}/${thumbnailFile.name}`)
          .then((info) => console.log(info))
          .catch((error) => console.log(error))

        delete thumbnailFile.buffer

        _.set(file, 'formats.thumbnail', thumbnailFile)
      }

      const formats = await generateResponsiveFormats(file)
      if (formats && Array.isArray(formats) && formats.length > 0) {
        for (const format of formats) {
          if (!format) continue

          const { key, file } = format

          // Store breakpoint file to filesystem
          sharp(file.buffer!)
            .jpeg()
            .toFile(`${finalDir}/${file.name}`)
            .then((info) => console.log(info))
            .catch((error) => console.log(error))

          delete file.buffer

          _.set(file, ['formats', key], file)
        }
      }

      const { width, height } = await getDimensions(file.buffer!)

      delete file.buffer

      _.assign(file, {
        provider: this.provider,
        width,
        height,
      })

      await this.add(file)
    })
  }

  public generateThumbnail = async (file: FileInfo): Promise<FileInfo | null> => {
    if (!(await canBeProcessed(file.buffer))) {
      return null
    }

    const { width, height } = await getDimensions(file.buffer!)

    if (!width || !height) return null

    if (width > THUMBNAIL_RESIZE_OPTIONS.width || height > THUMBNAIL_RESIZE_OPTIONS.height) {
      const newBuff = await resizeTo(file.buffer!, THUMBNAIL_RESIZE_OPTIONS)

      if (newBuff) {
        const { width, height, size } = await getMetadatas(newBuff)

        return {
          name: `thumbnail_${file.name}`,
          hash: `thumbnail_${file.hash}`,
          ext: file.ext,
          mime: file.mime,
          width: width!,
          height: height!,
          size: bytesToKbytes(size!),
          buffer: newBuff,
          path: file.path ? file.path : null,
        }
      }
    }

    return null
  }

  async add(fileInfo: FileInfo) {
    // Get provider
    const provider: FileProvider = await FileProvider.findByOrFail('name', this.provider)

    if (provider) {
      // Persist to database
      const uploadedFile = await this.requestedCompany?.related('uploadFiles').create({
        alternativeText: fileInfo.alternativeText,
        caption: fileInfo.caption,
        ext: fileInfo.ext,
        hash: fileInfo.hash,
        mime: fileInfo.mime,
        name: fileInfo.name,
        size: fileInfo.size,
        url: `${this.uploadDir}/${fileInfo.name}`,
        width: fileInfo.width,
        height: fileInfo.height,
        createdBy: this.requestedUser?.id,
        updatedBy: this.requestedUser?.id,
        fileProviderId: provider.id,
        formats: JSON.stringify(fileInfo.formats || null),
      })

      this.uploadedFileModel = uploadedFile
      return
    }
  }
}

export default FileUploadHelper
