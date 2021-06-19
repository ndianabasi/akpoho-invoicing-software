import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CacheHelper from 'App/Helpers/CacheHelper'
import UserServices from 'App/Services/UserServices'
import CompanyValidator from 'App/Validators/CompanyValidator'
import { CACHE_TAGS } from 'Contracts/cache'
import Logger from '@ioc:Adonis/Core/Logger'
import Company from 'App/Models/Company'
import Database from '@ioc:Adonis/Lucid/Database'

export default class CompaniesController {
  public async index({ response, auth, request, bouncer }: HttpContextContract) {
    await bouncer.with('CompanyPolicy').authorize('list')

    const authUser = auth.user
    if (authUser) {
      const {
        page,
        descending,
        perPage,
        sortBy,
        id,
        name,
        email,
        type,
        phone_number,
        city,
        company_size,
        state,
        country,
        created_at,
        updated_at,
      } = request.qs()

      const searchQuery = {
        id: id ?? null,
        name: name ?? null,
        email: email ?? null,
        type: type ?? null,
        phone_number: phone_number ?? null,
        city: city ?? '',
        company_size: company_size ?? null,
        state: state ?? null,
        country: country ?? null,
        created_at: created_at ?? null,
        updated_at: updated_at ?? null,
      }

      let subquery = Database.from('companies')
        .select(
          'companies.id',
          'companies.name',
          'companies.phone_number',
          'companies.address',
          'companies.is_approved',
          'companies.approved_at',
          'companies.city',
          'companies.created_at',
          'companies.email',
          'companies.updated_at',
          'companies.slug',
          'companies.type',
          'companies.website',
          'countries.name as country',
          'states.name as state',
          'company_sizes.size as company_size'
        )
        .leftJoin('company_user', (query) =>
          query.on('company_user.company_id', '=', 'companies.id')
        )
        .where('company_user.user_id', authUser.id)
        .leftJoin('company_sizes', (query) =>
          query.on('company_sizes.id', '=', 'companies.company_size_id')
        )
        .leftJoin('countries', (query) => query.on('countries.id', '=', 'companies.country_id'))
        .leftJoin('states', (query) => query.on('states.id', '=', 'companies.state_id'))

      if (sortBy) {
        subquery = subquery.orderBy(sortBy, descending === 'true' ? 'desc' : 'asc')
      }

      if (searchQuery) {
        subquery.where((query) => {
          for (const param in searchQuery) {
            if (Object.prototype.hasOwnProperty.call(searchQuery, param)) {
              let value = searchQuery[param]
              if (value) {
                if (value === 'true') value = true
                if (value === 'false') value = false

                if (param === 'company_size') {
                  query.where('company_sizes.id', value)
                } else if (param === 'country') {
                  query.where('countries.name', value)
                } else if (param === 'state') {
                  query.where('states.name', value)
                } else if (param === 'company_size') {
                  query.where('company_sizes.id', value)
                } else {
                  query.where(`companies.${param}`, value)
                  if (typeof value === 'string') {
                    query.orWhere(`companies.${param}`, 'like', `%${value}%`)
                  }
                }
              }
            }
          }
        })
      }

      const companies = await subquery.paginate(page ? page : 1, perPage ? perPage : 20)

      return response.ok({ data: companies })
    }
  }

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
          'is_approved',
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

  public async update({ response, request, requestedCompany, bouncer, auth }: HttpContextContract) {
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

    await bouncer.with('CompanyPolicy').authorize('create')

    requestedCompany?.merge({
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
    await requestedCompany?.save()

    // Clear the company's entire cache
    const userCompaniesTags = await new UserServices({ id: auth?.user?.id }).getCompaniesCacheTags()
    const sets = [...userCompaniesTags]
    await CacheHelper.flushTags(sets)

    return response.created({ data: requestedCompany?.id })
  }

  public async destroy({
    response,
    requestedCompany,
    requestedUser,
    bouncer,
    auth,
  }: HttpContextContract) {
    if (requestedCompany) {
      await bouncer.with('CompanyPolicy').authorize('delete', requestedCompany ?? undefined)

      requestedCompany?.delete()

      // Clear the company's entire cache
      const userCompaniesTags = await new UserServices({
        id: auth?.user?.id,
      }).getCompaniesCacheTags()
      const sets = [...userCompaniesTags]
      await CacheHelper.flushTags(sets)

      return response.created({ data: requestedUser?.id })
    } else {
      Logger.warn('Requested User not found in CompaniesController.destroy')
      return response.abort({ message: 'Requested company not found' })
    }
  }
}
