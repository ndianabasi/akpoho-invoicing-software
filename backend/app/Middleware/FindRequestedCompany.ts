import Company from 'App/Models/Company'
import NoEntityDefinedException from 'App/Exceptions/NoEntityDefinedException'
import { CustomContextContract } from '../Controllers/types/index'

export default class FindRequestedCompany {
  public async handle(ctx: CustomContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const { company_id } = ctx.params
    console.log(company_id)

    if (!company_id) throw new NoEntityDefinedException('No company is provided!')

    const company = await Company.findOrFail(company_id)
    ctx.requestedCompany = company

    await next()
  }
}
