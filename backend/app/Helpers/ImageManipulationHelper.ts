'use strict'

import sharp from 'sharp'
import { bytesToKbytes, nameToSlug } from 'App/Helpers/utils'
import crypto from 'crypto'
import fs from 'fs'
import { BreakpointFormat, FileDimensions, FileInfo } from './types/file'

// Todo: add this setting to .env or database
export let uploadSettings = {
  sizeOptimization: true,
  autoOrientation: true,
  responsiveDimensions: true,
}

const { responsiveDimensions } = uploadSettings

export const getFileBuffer = async (filePath: string) => {
  let readBuffer: Buffer
  try {
    readBuffer = await fs.promises.readFile(filePath)
  } catch (e) {
    throw e
  }
  return readBuffer
}

const randomSuffix = () => crypto.randomBytes(8).toString('hex')

export const generateFileName = (name: string) => {
  const baseName = nameToSlug(name, { replacement: '_' })
  return `${baseName}_${randomSuffix()}`
}

export const getMetadatas = async (buffer: Buffer) => await sharp(buffer).metadata()

export const getDimensions = (buffer: Buffer) =>
  getMetadatas(buffer).then(({ width, height }) => ({ width, height }))

export const THUMBNAIL_RESIZE_OPTIONS = {
  width: 245,
  height: 156,
  fit: 'inside' as sharp.FitEnum['inside'],
}

export const resizeTo = (buffer: Buffer, options: sharp.ResizeOptions) =>
  sharp(buffer)
    .withMetadata()
    .resize(options)
    .toBuffer()
    .catch(() => null)

export const breakpointSmallerThan = (breakpoint: number, { width, height }: FileDimensions) => {
  return breakpoint < width! || breakpoint < height!
}

const formatsToProcess = ['jpeg', 'png', 'webp', 'tiff']

export const canBeProcessed = async (buffer) => {
  const { format } = await getMetadatas(buffer)
  return format && formatsToProcess.includes(format)
}

const DEFAULT_BREAKPOINTS = {
  large: 1000,
  medium: 750,
  small: 500,
}

export const generateResponsiveFormats = async (file: FileInfo) => {
  if (!responsiveDimensions) return []

  if (!(await canBeProcessed(file.buffer!))) {
    return []
  }

  const originalDimensions: FileDimensions = await getDimensions(file.buffer!)

  return Promise.all(
    Object.keys(DEFAULT_BREAKPOINTS).map((key) => {
      const breakpoint = DEFAULT_BREAKPOINTS[key] as number

      if (breakpointSmallerThan(breakpoint, originalDimensions)) {
        return generateBreakpoint(key, { file, breakpoint })
      }
    })
  )
}

export const generateBreakpoint = async (
  key: string,
  { file, breakpoint }: { file: FileInfo; breakpoint: number }
): Promise<BreakpointFormat> => {
  const newBuff = await resizeTo(file.buffer!, {
    width: breakpoint,
    height: breakpoint,
    fit: 'inside',
  })

  if (newBuff) {
    const { width, height, size } = await getMetadatas(newBuff)

    return {
      key,
      file: {
        name: `${key}_${file.name}`,
        hash: `${key}_${file.hash}`,
        ext: file.ext,
        mime: file.mime,
        width: width!,
        height: height!,
        size: bytesToKbytes(size!),
        buffer: newBuff,
        path: file.path ? file.path : null,
      },
    }
  } else {
    return null
  }
}
