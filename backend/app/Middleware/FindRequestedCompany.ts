import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FindRequestedCompany {
  public async handle({ request, params }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const { company_id } = params
    console.log(company_id)

    await next()
  }
}
