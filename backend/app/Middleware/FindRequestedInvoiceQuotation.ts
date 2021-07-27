import NoEntityDefinedException from 'App/Exceptions/NoEntityDefinedException'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InvoiceQuotation from 'App/Models/InvoiceQuotation'

export default class FindRequestedInvoiceQuotation {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { invoice_quotation_id } = ctx.params

    if (!invoice_quotation_id)
      throw new NoEntityDefinedException('No invoice/quotation was provided!')

    const requestedInvoiceQuotation = await InvoiceQuotation.query()
      .where({
        id: invoice_quotation_id,
      })
      .first()

    if (!requestedInvoiceQuotation)
      return ctx.response.notFound({ message: 'Unknown invoice/quotation was requested' })

    ctx.requestedInvoiceQuotation = requestedInvoiceQuotation

    await next()
  }
}
