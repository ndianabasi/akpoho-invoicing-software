import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CacheHelper from 'App/Helpers/CacheHelper'
import UserServices from 'App/Services/UserServices'
import CompanyValidator from 'App/Validators/CompanyValidator'
import { CACHE_TAGS } from 'Contracts/cache'
import Logger from '@ioc:Adonis/Core/Logger'
import Company from 'App/Models/Company'

export default class CompaniesController {
  public async index({}: HttpContextContract) {}

  public async store({ response, request, bouncer, auth }: HttpContextContract) {
    const {
      isPersonalBrand,
      name,
      email,
      phoneNumber,
      address,
      city,
      size,
      stateId,
      countryId,
      website,
    } = await request.validate(CompanyValidator)

    const user = auth.user

    if (user) {
      await bouncer.with('CompanyPolicy').authorize('create')

      const newCompany = await user?.related('companies').create({
        name,
        email,
        phoneNumber,
        address,
        city,
        companySizeId: size,
        stateId,
        countryId,
        website,
        type: isPersonalBrand ? 'personal' : 'corporate',
      })

      // Clear the user's entire cache
      const userCompaniesTags = await new UserServices({ id: user.id }).getCompaniesCacheTags()
      const sets = [
        `${CACHE_TAGS.USER_CACHE_TAG_PREFIX}:${user.id}`,
        `${CACHE_TAGS.COMPANY_USERS_CACHE_TAG_PREFIX}:${user.id}`,
        `${CACHE_TAGS.COMPANY_USERS_INDEX_CACHE_TAG_PREFIX}:${user.id}`,
        ...userCompaniesTags,
      ]
      await CacheHelper.flushTags(sets)

      return response.created({ data: newCompany?.id })
    } else return response.abort({ message: 'User not found' })
  }

  public async show({ response, requestedCompany, bouncer }: HttpContextContract) {
    if (requestedCompany) {
      // Check authorisation
      await bouncer.with('CompanyPolicy').authorize('view', requestedCompany)

      const company = await Company.query()
        .select(
          'id',
          'name',
          'phone_number',
          'address',
          'approved_at',
          'city',
          'created_at',
          'email',
          'updated_at',
          'slug',
          'type',
          'website',
          'company_size_id',
          'country_id',
          'state_id'
        )
        .where('id', requestedCompany.id)
        .preload('companySize', (query) => query.select('id', 'size'))
        .preload('country', (query) => query.select('id', 'name'))
        .preload('state', (query) => query.select('id', 'name'))
        .first()

      return response.ok({ data: company })
    } else {
      Logger.warn('Requested company not found at CompaniesController.show')
    }
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
