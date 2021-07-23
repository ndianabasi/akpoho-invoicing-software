import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CacheHelper from 'App/Helpers/CacheHelper'
import UserServices from 'App/Services/UserServices'
import CompanyValidator from 'App/Validators/CompanyValidator'
import { CACHE_TAGS } from 'Contracts/cache'
import Logger from '@ioc:Adonis/Core/Logger'
import Company from 'App/Models/Company'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'
import { DateTime } from 'luxon'
import { snakeCase } from 'lodash'
import { AttachedFile, FileData } from 'types/file'
import FileUploadHelper from 'App/Helpers/FileUploadHelper'
import FileDeletionHelper from 'App/Helpers/FileDeletionHelper'

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
          'companies.type',
          'companies.website',
          'countries.name as country',
          'states.name as state',
          'company_sizes.size as company_size',
          'uploaded_files.url as logo_url',
          'uploaded_files.formats as logo_formats'
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
        .leftJoin('uploaded_files', (query) => query.on('uploaded_files.id', '=', 'companies.logo'))

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

  public async store({ response, request, bouncer, auth, requestedCompany }: HttpContextContract) {
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
      logo,
    } = await request.validate(CompanyValidator)

    const requestMethod = request.method()
    const user = auth.user
    let companyModel: Company | undefined

    if (user) {
      if (requestMethod === 'POST') {
        await bouncer.with('CompanyPolicy').authorize('create')

        companyModel = await user?.related('companies').create({
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
      } else if (requestMethod === 'PATCH') {
        companyModel = requestedCompany
        await bouncer.with('CompanyPolicy').authorize('edit', companyModel!)

        companyModel?.merge({
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
        await companyModel?.save()
      }

      await companyModel?.refresh()
      // Check if company already has a logo
      const oldLogo = companyModel?.logo
      const hasOldLogo = !!oldLogo

      // Process uploaded file (if any)
      if (logo) {
        const companyName = companyModel?.name!
        const firstLetter = companyName.charAt(0)
        const secondLetter = companyName.charAt(1)
        const finalUploadDir = `uploads/company_logos/${firstLetter}/${secondLetter}`.toLowerCase()

        const fileName = `${snakeCase(companyName)}_${DateTime.now().toMillis()}`.toLowerCase()
        await logo.move(Application.tmpPath('uploads/company_logos/'), {
          name: `${fileName}.${logo.extname}`,
          overwrite: true,
        })

        // Generate file formats using sharp and persist them
        const fileObject: AttachedFile = {
          filePath: logo.filePath,
          name: fileName,
          type: logo.type!,
          size: logo.size!,
        }

        const mime = logo.type + '/' + logo.subtype

        const fileData: FileData = {
          data: {
            fileInfo: {
              ext: '',
              hash: '',
              mime,
              size: fileObject.size,
              alternativeText: '',
              caption: '',
              name: fileObject.name,
              path: fileObject.filePath,
            },
          },
          files: logo,
        }

        const fileUploadHelper = new FileUploadHelper(
          fileData,
          finalUploadDir,
          'local',
          'company_logo'
        )
        await fileUploadHelper.upload().then(async (uploadedFileModel) => {
          // Associate company with the uploaded file
          companyModel?.merge({ logo: uploadedFileModel?.id })
          await companyModel?.save()
        })

        if (hasOldLogo) {
          // Delete old profile picture
          await new FileDeletionHelper(oldLogo!).delete()
        }
      }

      // Clear the user's entire cache
      const userCompaniesTags = await new UserServices({ id: user.id }).getCompaniesCacheTags()
      const sets = [
        `${CACHE_TAGS.USER_CACHE_TAG_PREFIX}:${user.id}`,
        `${CACHE_TAGS.COMPANY_USERS_CACHE_TAG_PREFIX}:${user.id}`,
        `${CACHE_TAGS.COMPANY_USERS_INDEX_CACHE_TAG_PREFIX}:${user.id}`,
        ...userCompaniesTags,
      ]
      await CacheHelper.flushTags(sets)

      return response.created({ data: companyModel?.id })
    } else return response.abort({ message: 'User not found' })
  }

  public async show({ response, requestedCompany, bouncer }: HttpContextContract) {
    if (requestedCompany) {
      // Check authorisation
      await bouncer.with('CompanyPolicy').authorize('view', requestedCompany)

      const company = await Company.query()
        .where('id', requestedCompany.id)
        .preload('companySize', (query) => query.select('id', 'size'))
        .preload('country', (query) => query.select('id', 'name'))
        .preload('state', (query) => query.select('id', 'name'))
        .preload('companyLogo', (fileQuery) => fileQuery.select('formats', 'url'))
        .first()

      const serialisedCompany = company?.serialize({
        fields: {
          pick: [
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
          ],
        },
      })

      return response.ok({ data: serialisedCompany })
    } else {
      Logger.warn('Requested company not found at CompaniesController.show')
    }
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
