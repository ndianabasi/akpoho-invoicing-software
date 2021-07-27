import fs from 'fs'
import path from 'path'

import Logger from '@ioc:Adonis/Core/Logger'

/**
 * A function to create and test a directory using nodejs' fs module
 *
 * @param {String} dirPath The directory to be created. Could be absolute or relative path
 * @example createDirectory('parentDirName1/parentDirName2/finalDirname')
 * @returns true | Error
 */
const createDirectory = function (dirPath: string) {
  return new Promise((resolve, reject) => {
    const isAbsolutePath = path.isAbsolute(dirPath)
    const fullDirPath = isAbsolutePath ? dirPath : path.join(process.cwd(), dirPath)
    fs.promises
      .readdir(fullDirPath)
      .then(() => {
        Logger.info(
          `Helpers/createDirectory.js -> createDirectory(): dir '${dirPath}' already exists.`
        )
        resolve(true)
      })
      .catch((err) => {
        Logger.error(
          `Helpers/createDirectory.js -> createDirectory(): Error while reading dir '${dirPath}': %j.`,
          err
        )
        Logger.info(
          'Helpers/createDirectory.js -> createDirectory(): Creating the directory: %s.',
          fullDirPath
        )

        fs.promises
          .mkdir(fullDirPath, { recursive: true })
          .then((data) => {
            Logger.info(
              `Helpers/createDirectory.js -> createDirectory(): dir '${dirPath}' is created: %j.`,
              data
            )
            resolve(true)
          })
          .catch((err) => {
            Logger.error(
              `Helpers/createDirectory.js -> createDirectory(): Error while creating dir '${dirPath}': %j.`,
              err
            )
            reject(err)
          })
      })
  })
}

export default createDirectory
