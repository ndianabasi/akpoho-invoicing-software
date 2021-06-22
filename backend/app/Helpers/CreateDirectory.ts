import fs from 'fs'
import path from 'path'

import Logger from '@ioc:Adonis/Core/Logger'

/**
 * A function to create and test a directory using nodejs' fs module
 *
 * @param {String} relativeDirPath The complete relative path from the CWD of the process to the directory to be created.
 * This should include the name of the directory as the last word
 *
 * @example createDirectory('parentDirName1/parentDirName2/finalDirname')
 *
 * @returns true | Error
 */
const createDirectory = function (relativeDirPath: string) {
  return new Promise((resolve, reject) => {
    const fullDirPath = path.join(process.cwd(), relativeDirPath)
    console.log(fullDirPath)
    fs.promises
      .readdir(fullDirPath)
      .then(() => {
        Logger.info(
          `Helpers/createDirectory.js -> createDirectory(): dir '${relativeDirPath}' already exists.`
        )
        resolve(true)
      })
      .catch((err) => {
        Logger.error(
          `Helpers/createDirectory.js -> createDirectory(): Error while reading dir '${relativeDirPath}': %j.`,
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
              `Helpers/createDirectory.js -> createDirectory(): dir '${relativeDirPath}' is created: %j.`,
              data
            )
            resolve(true)
          })
          .catch((err) => {
            Logger.error(
              `Helpers/createDirectory.js -> createDirectory(): Error while creating dir '${relativeDirPath}': %j.`,
              err
            )
            reject(err)
          })
      })
  })
}

export default createDirectory
