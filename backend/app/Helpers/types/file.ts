import { FileFormats } from 'App/Models/UploadedFile'

export type FileData = {
  data: { fileInfo: FileInfo | FileInfo[]; metas?: FileMetaInfo }
  files: AttachedFile
}

export type FileMetaInfo = {
  refId: string | number
  ref: string | number
  source: string
  field: string
  path?: string
} | null

export type AttachedFile = { filePath?: string; name?: string; type?: string; size: number }

export type EnhancedFileInfo = { filename: string; type: string; size: number }

export type FileInfo = {
  name?: string
  caption?: string
  alternativeText?: string
  hash?: string
  ext: string
  mime: string
  size: number
  related?: Array<FileMetaInfo>
  path?: string | null
  buffer?: Buffer | null
  width?: number
  height?: number
  formats?: FileFormats | null
}

export type OptimizedOutput = {
  buffer: Buffer
  info?: {
    width: number
    height: number
    size: number
  }
}

export type FileDimensions = {
  width: number | undefined
  height: number | undefined
}

export type BreakpointFormat = ({ key: string } & { file: FileInfo }) | null
