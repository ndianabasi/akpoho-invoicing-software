import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import CacheHelper from 'App/Helpers/CacheHelper'
import UserServices from 'App/Services/UserServices'
import UserValidator from 'App/Validators/UserValidator'
import { CACHE_TAGS } from 'Contracts/cache'
import { ROLES } from 'Database/data/roles'
import querystring from 'querystring'
import Logger from '@ioc:Adonis/Core/Logger'
import Application from '@ioc:Adonis/Core/Application'
import { DateTime } from 'luxon'
import FileUploadHelper from 'App/Helpers/FileUploadHelper'
import { AttachedFile, FileData } from 'types/file'
import FileDeletionHelper from 'App/Helpers/FileDeletionHelper'
import User from 'App/Models/User'
import UserProfile from 'App/Models/UserProfile'

export default class UsersController {
  public async index({ response, requestedCompany, request, bouncer }: HttpContextContract) {
    await bouncer.with('UserPolicy').authorize('list', requestedCompany!)

    const {
      page,
      descending,
      perPage,
      sortBy,
      id,
      email,
      login_status,
      is_account_activated,
      is_email_verified,
      lifetime_login,
      last_login_time,
      account_activated_at,
      email_verified_at,
      created_at,
      updated_at,
      first_name,
      last_name,
      role,
    } = request.qs()

    const searchQuery = {
      id: id ? id : null,
      email: email ? email : null,
      login_status: login_status ? login_status : null,
      is_account_activated: is_account_activated ? is_account_activated : null,
      is_email_verified: is_email_verified ? is_email_verified : null,
      lifetime_login: lifetime_login ? lifetime_login : null,
      last_login_time: last_login_time ? last_login_time : null,
      account_activated_at: account_activated_at ? account_activated_at : null,
      email_verified_at: email_verified_at ? email_verified_at : null,
      created_at: created_at ? created_at : null,
      updated_at: updated_at ? updated_at : null,
      first_name: first_name ? first_name : null,
      last_name: last_name ? last_name : null,
      role: role ? role : null,
    }

    const cacheQuerystring = querystring.stringify(request.qs())
    const cacheKey = `company_users_index:${requestedCompany?.id}__`.concat(cacheQuerystring)
    const sets = [
      `${CACHE_TAGS.ALL_COMPANIES_CACHES_TAG}`,
      `${CACHE_TAGS.ALL_USERS_CACHES_TAG}`,
      `${CACHE_TAGS.COMPANY_CACHE_TAG_PREFIX}:${requestedCompany?.id}`,
      `${CACHE_TAGS.COMPANY_USERS_CACHE_TAG_PREFIX}:${requestedCompany?.id}`,
      `${CACHE_TAGS.COMPANY_USERS_INDEX_CACHE_TAG_PREFIX}:${requestedCompany?.id}`,
    ]

    let usersIndex: { meta: any; data: any[] } | null = null
    await CacheHelper.get(cacheKey)
      .then(async (result) => {
        if (result) {
          usersIndex = result
        } else {
          // Compute and set a new key-value pair
          let subquery = Database.from('users')
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
              'users.updated_at',
              'user_profiles.first_name',
              'user_profiles.last_name',
              'roles.name as role'
            )
            .leftJoin('company_user', (query) => {
              query.on('company_user.user_id', '=', 'users.id')
            })
            .leftJoin('user_profiles', (query) => {
              query.on('user_profiles.user_id', '=', 'users.id')
            })
            .leftJoin('roles', (query) => {
              query.on('roles.id', '=', 'users.role_id')
            })
            .where({ 'company_user.company_id': requestedCompany?.id })

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

                    if (param === 'role') query.where('role_id', value)
                    else {
                      //console.log(param, value)
                      query.where(param, value)
                      if (typeof value === 'string') {
                        query.orWhere(param, 'like', `%${value}%`)
                      }
                    }
                  }
                }
              }
            })
          }

          const users = await subquery.paginate(page ? page : 1, perPage ? perPage : 20)

          const serialisedUsers = users?.toJSON()

          await CacheHelper.put(cacheKey, serialisedUsers)

          // Add the `cacheKey` to sets
          await CacheHelper.tag(sets, cacheKey)

          usersIndex = serialisedUsers
        }
      })
      .catch((error) => {
        Logger.error('Error from App/Controllers/UsersController.index: %o', error)
      })

    return response.ok({ data: usersIndex })
  }

  public async show({ response, requestedCompany, requestedUser, bouncer }: HttpContextContract) {
    await bouncer.with('UserPolicy').authorize('view', requestedCompany ?? null, requestedUser!)

    const userService = new UserServices({ id: requestedUser?.id })

    const cachedUserDetails = await userService.getFullUserDetails()

    return response.ok({ data: cachedUserDetails })
  }

  public async store({
    response,
    requestedCompany,
    requestedUser,
    request,
    bouncer,
  }: HttpContextContract) {
    const {
      first_name,
      last_name,
      middle_name,
      phone_number,
      address,
      city,
      email,
      role_id,
      state_id,
      country_id,
      login_status,
      profile_picture,
    } = await request.validate(UserValidator)

    const requestMethod = request.method()

    let creationMode = true
    let userModel: User | undefined
    let requestedUserProfile: UserProfile | undefined

    if (requestMethod === 'POST') {
      await bouncer.with('UserPolicy').authorize('create', requestedCompany!)

      userModel = await requestedCompany
        ?.related('users')
        .create({ email, loginStatus: login_status, roleId: role_id })

      requestedUserProfile = await userModel?.related('profile').create({
        firstName: first_name,
        middleName: middle_name && middle_name !== 'null' ? middle_name : '',
        lastName: last_name,
        phoneNumber: phone_number,
        address,
        city,
        stateId: state_id || null,
        countryId: country_id || null,
      })
    } else if (requestMethod === 'PATCH') {
      creationMode = false
      await bouncer.with('UserPolicy').authorize('edit', requestedCompany!, requestedUser!)

      userModel = requestedUser

      userModel?.merge({ email, loginStatus: login_status })
      await userModel?.save()

      // Ensure that a SuperAdmin does not lose login access
      await userModel?.load('role')
      if (userModel?.role?.name !== ROLES.SUPERADMIN) {
        userModel?.merge({ roleId: role_id })
        await userModel?.save()
      }

      await userModel?.load('profile')
      requestedUserProfile = userModel?.profile
      requestedUserProfile?.merge({
        firstName: first_name,
        middleName: middle_name && middle_name !== 'null' ? middle_name : '',
        lastName: last_name,
        phoneNumber: phone_number,
        address,
        city,
        stateId: state_id || null,
        countryId: country_id || null,
      })
      await requestedUserProfile?.save()

      await requestedUserProfile?.refresh()
    } else return response.badRequest({ message: 'This request is not recognised' })

    const fileStatus = { fileExists: false, uploaded: false }

    // Check if user profile already has a profile picture
    const oldProfilePicture = requestedUserProfile?.profilePicture
    const hasOldProfilePicture = !!oldProfilePicture

    // Process uploaded file (if any)
    if (profile_picture) {
      fileStatus.fileExists = true

      const firstName = requestedUserProfile?.firstName!
      const lastName = requestedUserProfile?.lastName!
      const firstLetter = firstName.charAt(0)
      const secondLetter = firstName.charAt(1)
      const finalUploadDir = `uploads/profile_pictures/${firstLetter}/${secondLetter}`.toLowerCase()

      const fileName = `${firstName}_${lastName}_${DateTime.now().toMillis()}`.toLowerCase()
      await profile_picture.move(Application.tmpPath('uploads/user_profile_pictures/'), {
        name: `${fileName}.${profile_picture.extname}`,
        overwrite: true,
      })

      // Generate file formats using sharp and persist them
      const fileObject: AttachedFile = {
        filePath: profile_picture.filePath,
        name: fileName,
        type: profile_picture.type!,
        size: profile_picture.size!,
      }

      const mime = profile_picture.type + '/' + profile_picture.subtype

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
        files: profile_picture,
      }

      const fileUploadHelper = new FileUploadHelper(
        fileData,
        finalUploadDir,
        'local',
        'user_profile_picture'
      )
      await fileUploadHelper.upload().then(async (uploadedFileModel) => {
        fileStatus.uploaded = true
        // Associate profile picture with the uploaded file
        requestedUserProfile?.merge({ profilePicture: uploadedFileModel?.id })
        await requestedUserProfile?.save()
      })

      if (hasOldProfilePicture) {
        // Delete old profile picture
        await new FileDeletionHelper(oldProfilePicture!).delete()
      }
    }

    // Clear the user's entire cache
    const sets = [
      `${CACHE_TAGS.USER_CACHE_TAG_PREFIX}:${requestedUser?.id}`,
      `${CACHE_TAGS.COMPANY_USERS_CACHE_TAG_PREFIX}:${requestedCompany?.id}`,
      `${CACHE_TAGS.COMPANY_USERS_INDEX_CACHE_TAG_PREFIX}:${requestedCompany?.id}`,
    ]
    await CacheHelper.flushTags(sets)

    return response.created({
      message: `User was successfully ${creationMode ? 'created' : 'edited'}.`,
      fileStatus,
      data: userModel?.id,
    })
  }

  public async destroy({
    response,
    requestedCompany,
    requestedUser,
    bouncer,
  }: HttpContextContract) {
    await bouncer.with('UserPolicy').authorize('delete', requestedCompany ?? null, requestedUser!)

    // Ensure that a SuperAdmin is not deleted
    if (requestedUser?.role?.name !== ROLES.SUPERADMIN) {
      requestedUser?.delete()

      // Wipe off all caches for the user
      const sets = [
        `${CACHE_TAGS.USER_CACHE_TAG_PREFIX}:${requestedUser?.id}`,
        `${CACHE_TAGS.USER_DETAILS_CACHE_TAG_PREFIX}:${requestedUser?.id}`,
        `${CACHE_TAGS.USER_SUMMARY_CACHE_TAG_PREFIX}:${requestedUser?.id}`,
        `${CACHE_TAGS.COMPANY_USERS_CACHE_TAG_PREFIX}:${requestedCompany?.id}`,
        `${CACHE_TAGS.COMPANY_USERS_INDEX_CACHE_TAG_PREFIX}:${requestedCompany?.id}`,
      ]
      await CacheHelper.nukeTags(sets)

      return response.created({ data: requestedUser?.id })
    } else {
      return response.badRequest({ message: 'User cannot be deleted!' })
    }
  }
}
