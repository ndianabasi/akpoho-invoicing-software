import Application from '@ioc:Adonis/Core/Application'
import puppeteer, { PaperFormat } from 'puppeteer'
import HttpContext from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'

interface PrintOptions {
  paperFormat?: PaperFormat
}

export default class PuppeteerServices {
  private options: PrintOptions

  constructor(private url: string, options?: PrintOptions) {
    this.options = options ? options : {}
    this.options.paperFormat = options?.paperFormat ?? 'a4'
  }

  public async printAsPDF() {
    try {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()

      // 1. Create PDF from URL
      await page.goto(this.url)
      await page.waitForNavigation({
        timeout: 1 * 60 * 1000 /* 2 minute timeout */,
        waitUntil:
          'networkidle0' /* consider navigation to be finished when there are no more than 0 network connections for at least 500 ms */,
      })

      // 2. Save a PDF
      const filePath = Application.tmpPath('gotedo.pdf')

      await page.emulateMediaType('screen')
      await page
        .pdf({
          path: filePath,
          format: this.options.paperFormat,
          printBackground: true,
          margin: { left: '20px', right: '20px', top: '20px', bottom: '20px' },
        })
        .catch((error) => {
          Logger.error('Error at PuppeteerServices.printAsPDF. %j', error)
        })

      await browser.close()

      // 3. Return response from here, skipping the controller
      const ctx = HttpContext.get()
      ctx?.response.download(filePath)
    } catch (error) {
      Logger.error('Error at PuppeteerServices.printAsPDF. %j', error)
    }
  }
}
