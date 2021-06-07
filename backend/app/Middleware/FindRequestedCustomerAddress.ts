import NoEntityDefinedException from 'App/Exceptions/NoEntityDefinedException'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomerAddress from 'App/Models/CustomerAddress'

export default class FindRequestedCustomerAddress {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { params } = ctx

    const { customer_address_id } = params
    if (!customer_address_id) throw new NoEntityDefinedException('No customer address is provided!')

    let address
    try {
      address = address = await CustomerAddress.findOrFail(customer_address_id)
    } catch (error) {
      return ctx.response.notFound({ message: 'Unknown customer address was requested' })
    }

    ctx.requestedCustomerAddress = address

    await next()
  }
}
