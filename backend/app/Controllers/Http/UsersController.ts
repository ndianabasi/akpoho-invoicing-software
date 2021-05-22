import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { CustomContextContract } from '../../Controllers/types/index'

export default class UsersController {
  public async index({ response, requestedCompany, request, bouncer }: CustomContextContract) {
    await bouncer.with('UserPolicy').authorize('list', requestedCompany!)

    const { search, page, descending, perPage, sortBy } = request.qs()
    //console.log(search, page, descending, perPage, sortBy)

    let subquery = User.query()
      .select(
        'users.id',
        'users.email',
        'users.login_status',
        'users.is_account_activated',
        'users.is_email_verified',
        'users.lifetime_login',
        'users.password_change_required',
        'users.last_login_time',
        'users.account_activated_at',
        'users.email_verified_at',
        'users.created_at',
        'users.updated_at'
      )
      .leftJoin('company_user', (query) => {
        query.on('company_user.user_id', '=', 'users.id')
      })
      .where({ 'company_user.company_id': requestedCompany?.id })

    if (sortBy) {
      subquery = subquery.orderBy(sortBy, descending === 'true' ? 'desc' : 'asc')
    }

    const users = await subquery.paginate(page ? page : 1, perPage ? perPage : 20)

    return response.ok({ data: users })
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
