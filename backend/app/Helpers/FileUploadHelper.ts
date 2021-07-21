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
} from '../../types/file'

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
  protected UPLOAD_DIR_PREFIX = 'public'

  /**
   *
   * @param fileData {FileData} The data of the attached file(s)
   * @param uploadDir {string} The upload directory
   */
  constructor(fileData: FileData, uploadDir: string, provider: string) {
    const { requestedUser, requestedCompany } = this.getContext
    this.requestedUser = requestedUser
    this.requestedCompany = requestedCompany

    this.fileData = fileData
    this.uploadDir = uploadDir
    this.provider = provider
  }

  private get getContext() {
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
    const { absoluteFilePath, size } = enhancedInfo
    const ext = fileInfo.ext || path.extname(absoluteFilePath)
    const basename = path.basename(fileInfo.name || absoluteFilePath, ext)

    const usedName = fileInfo.name || basename

    const entity: FileInfo = {
      name: usedName,
      alternativeText: fileInfo.alternativeText,
      caption: fileInfo.caption,
      hash: this.generateFileName(basename),
      ext,
      mime: fileInfo.mime,
      size: bytesToKbytes(size),
      width: fileInfo.width,
      height: fileInfo.height,
      url: `${this.uploadDir}/${usedName}.${ext}`,
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
        absoluteFilePath: file.filePath!,
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
            format: info.format,
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
      const fileData = await this.enhanceFile(file, fileInfo, metas)

      return this.uploadFileAndPersist(fileData)
    }

    for (let i = 0; i < fileArray.length; i++) {
      const file: AttachedFile = fileArray[i]
      await doUpload(file, fileInfoArray[i] || {})
    }

    return this.uploadedFileModel
  }

  public async uploadFileAndPersist(file: FileInfo) {
    const finalDir = `${this.UPLOAD_DIR_PREFIX}/${this.uploadDir}`
    await createDirectory(finalDir).then(async () => {
      // Generate main file which serves as the origin
      sharp(file.buffer!)
        .jpeg()
        .toFile(`${this.UPLOAD_DIR_PREFIX}/${file.url}`)
        .then((info) => console.log(info))
        .catch((error) => console.log(error))

      // Generate and upload thumbnails
      const thumbnailFile = await this.generateThumbnail(file)
      if (thumbnailFile) {
        // Store thumbnailFile to filesystem
        sharp(thumbnailFile.buffer!)
          .jpeg()
          .toFile(`${finalDir}/${thumbnailFile.name}.${thumbnailFile.ext}`)
          .then((info) => console.log(info))
          .catch((error) => console.log(error))

        delete thumbnailFile.buffer

        _.set(file, 'formats.thumbnail', thumbnailFile)
      }

      const formats = await generateResponsiveFormats(file, this.uploadDir)
      if (formats && Array.isArray(formats) && formats.length > 0) {
        for (const format of formats) {
          if (!format) continue

          const { key, file: responsiveFile } = format

          // Store breakpoint file to filesystem
          sharp(responsiveFile.buffer!)
            .jpeg()
            .toFile(`${finalDir}/${responsiveFile.name}.${responsiveFile.ext}`)
            .then((info) => console.log(info))
            .catch((error) => console.log(error))

          delete responsiveFile.buffer

          _.set(file, ['formats', key], responsiveFile)
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
        const { width, height, size, format } = await getMetadatas(newBuff)

        const ext = (format as string) || file.ext
        const thumbnailFileName = `thumbnail_${file.name}`

        return {
          name: thumbnailFileName,
          hash: `thumbnail_${file.hash}`,
          ext,
          mime: file.mime,
          width: width!,
          height: height!,
          size: bytesToKbytes(size!),
          buffer: newBuff,
          path: file.path ? file.path : null,
          url: `${this.uploadDir}/${thumbnailFileName}.${ext}`,
        }
      }
    }

    return null
  }

  public async add(fileInfo: FileInfo) {
    // Get provider
    const provider: FileProvider = await FileProvider.findByOrFail('name', this.provider)

    if (provider.name === 'local') {
      // Persist to database
      const uploadedFile = await this.requestedCompany?.related('uploadFiles').create({
        alternativeText: fileInfo.alternativeText,
        caption: fileInfo.caption,
        ext: fileInfo.ext,
        hash: fileInfo.hash,
        mime: fileInfo.mime,
        name: fileInfo.name,
        size: fileInfo.size,
        url: fileInfo.url!,
        width: fileInfo.width,
        height: fileInfo.height,
        createdBy: this.requestedUser?.id,
        updatedBy: this.requestedUser?.id,
        fileProviderId: provider.id,
        formats: fileInfo.formats || null,
      })

      this.uploadedFileModel = uploadedFile
      return
    }
  }
}

export default FileUploadHelper
