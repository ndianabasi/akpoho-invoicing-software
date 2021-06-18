import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CacheHelper from 'App/Helpers/CacheHelper'
import UserServices from 'App/Services/UserServices'
import CompanyValidator from 'App/Validators/CompanyValidator'
import { CACHE_TAGS } from 'Contracts/cache'

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

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
