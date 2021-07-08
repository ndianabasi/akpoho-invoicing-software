import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { globalRoles } from '../../database/data/roles'

export default class FindRequestedCompany {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    await ctx.auth.user?.load('role')
    const userRole = ctx.auth.user?.role

    const isGlobalUser = userRole ? globalRoles.some((role) => role === userRole?.name) : false

    ctx.authRole = userRole
    ctx.isGlobalUser = isGlobalUser

    await next()
  }
}
