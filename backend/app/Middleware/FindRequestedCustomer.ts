import Customer from 'App/Models/Customer'
import NoEntityDefinedException from 'App/Exceptions/NoEntityDefinedException'
import { CustomContextContract } from '../Controllers/types/index'

export default class FindRequestedCustomer {
  public async handle(ctx: CustomContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const { customer_id } = ctx.params
    //console.log(customer_id)

    if (!customer_id) throw new NoEntityDefinedException('No customer is provided!')

    let customer
    try {
      customer = customer = await Customer.findOrFail(customer_id)
    } catch (error) {
      return ctx.response.notFound({ message: 'Unknown customer was requested' })
    }

    ctx.requestedCustomer = customer

    await next()
  }
}
