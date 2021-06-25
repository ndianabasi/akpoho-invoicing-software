import Company from 'App/Models/Company'
import NoEntityDefinedException from 'App/Exceptions/NoEntityDefinedException'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FindRequestedCompany {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { company_id } = ctx.params

    if (!company_id) throw new NoEntityDefinedException('No company is provided!')

    let company
    try {
      company = await Company.findOrFail(company_id)
    } catch (error) {
      return ctx.response.notFound({ message: 'Unknown company was requested' })
    }

    ctx.requestedCompany = company

    await next()
  }
}
