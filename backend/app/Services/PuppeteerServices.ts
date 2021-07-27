import Application from '@ioc:Adonis/Core/Application'
import puppeteer, { PaperFormat } from 'puppeteer'
import HttpContext from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import path from 'path'
import createDirectory from 'App/Helpers/CreateDirectory'

interface PrintOptions {
  paperFormat?: PaperFormat
  fileName: string
}

export default class PuppeteerServices {
  private paperFormat: PaperFormat
  private fileName: string

  constructor(private url: string, options: PrintOptions) {
    this.paperFormat = options?.paperFormat ?? 'a4'
    if (!options.fileName) throw new Error('File name is required!')
    if (options.fileName.length < 2) throw new Error('File name must be at least 2 characters!')
    this.fileName = options.fileName
  }

  public async printAsPDF() {
    const ctx = HttpContext.get()

    try {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()

      // 1. Create PDF from URL
      await page.goto(this.url)

      /* await page
        .waitForNavigation({
          timeout: 1 * 60 * 1000, // 2 minute timeout
          waitUntil: 'networkidle0', //consider navigation to be finished when there are no more than 0 network connections for at least 500 ms
        })
        .then(() => {
          console.log('waitForNavigation done')
        }) */

      // 2. Save a PDF
      await this.prepareFilePath(this.fileName).then(async (filePath) => {
        await page.emulateMediaType('screen')
        await page
          .pdf({
            path: filePath,
            format: this.paperFormat,
            scale: 0.8,
            printBackground: true,
            margin: { left: '20px', right: '20px', top: '20px', bottom: '20px' },
          })
          .then(() => console.log('File created'))
          .catch((error) => {
            Logger.error('Error at PuppeteerServices.printAsPDF > page.pdf(): %j', error)
            ctx?.response.internalServerError({ data: error })
          })

        await browser.close()
        ctx?.response.download(filePath)
      })
    } catch (error) {
      Logger.error('Error at PuppeteerServices.printAsPDF > catch block: %j', error)
      ctx?.response.internalServerError({ message: error })
    }
  }

  /**
   * Prepare the baseDir of the file. Create if it does not exist
   * @param fileName The file name
   * @returns
   */
  private prepareFilePath(fileName: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const filePath = Application.tmpPath(
        `${fileName.charAt(0)}/${fileName.charAt(1)}/${fileName}.pdf`
      )
      const baseDir = path.dirname(filePath)

      // Create baseDir if it does not exist
      await createDirectory(baseDir)
        .then(async () => {
          resolve(filePath)
        })
        .catch((error) => reject(error))
    })
  }
}
