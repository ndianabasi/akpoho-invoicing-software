import Company from 'App/Models/Company'
import NoEntityDefinedException from 'App/Exceptions/NoEntityDefinedException'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FindRequestedCompany {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { company_id } = ctx.params

    if (!company_id) throw new NoEntityDefinedException('No company is provided!')

    let requestedCompany
    try {
      requestedCompany = await Company.findOrFail(company_id)
    } catch (error) {
      return ctx.response.notFound({ message: 'Unknown company was requested' })
    }

    const authUser = ctx.auth.user ?? null
    await authUser?.load('companies')
    const authCompanies = authUser?.companies

    const belongsToRequestedCompany = authCompanies?.some(
      (authCompany) => authCompany.id === requestedCompany.id
    )

    if (!belongsToRequestedCompany)
      return ctx.response.forbidden({
        message: 'You are not allowed to access this company. Please check your current company',
      })

    ctx.requestedCompany = requestedCompany

    await next()
  }
}
