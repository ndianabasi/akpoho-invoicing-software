'use strict'

import User from 'App/Models/User'
import { UserFullDetails, UserOptions, UserSummary } from './types/user_types'
import Logger from '@ioc:Adonis/Core/Logger'
import CacheHelper from 'App/Helpers/CacheHelper'
import { CACHE_TAGS } from 'Contracts/cache'

export default class UserServices {
  protected email: string | undefined
  protected id: string | undefined
  protected user: User | null

  public constructor(userOptions?: UserOptions) {
    if (userOptions) {
      const { email, id } = userOptions
      if (email && id)
        throw new Error('You should not supply both `email` and `id` at the same time.')
      if (!email && !id)
        throw new Error('The userOptions object should have either email or id property.')
      this.email = email
      this.id = id
    }

    this.user = null
  }

  public async getUserModel(): Promise<User> {
    try {
      let user: User
      if (this.email) {
        user = await User.findByOrFail('email', this.email)
      } else if (this.id) {
        user = await User.findOrFail(this.id)
      }

      if (user! && !this.id) {
        this.id = user.id
        this.user = user
      }
      return user!
    } catch (error) {
      throw new Error('User not found')
    }
  }

  public async getUserCompanies(): Promise<User['companies']> {
    try {
      const user = await this.getUserModel()
      await user.load('companies')
      return user.companies
    } catch (error) {
      throw new Error('User not found')
    }
  }

  async getCompaniesCacheTags(): Promise<string[]> {
    const companies = await this.getUserCompanies()

    let companiesCacheTags: string[] = [],
      companiesUsersCacheTags: string[] = []

    if (companies?.length) {
      companiesCacheTags = companies?.map(
        (com) => `${CACHE_TAGS.COMPANY_CACHE_TAG_PREFIX}:${com.id}`
      )
      companiesUsersCacheTags = companies?.map(
        (com) => `${CACHE_TAGS.COMPANY_USERS_CACHE_TAG_PREFIX}:${com.id}`
      )
    }

    return [...companiesCacheTags, ...companiesUsersCacheTags]
  }

  public async getUserSummary(): Promise<UserSummary | unknown> {
    const user = await this.getUserModel()

    const cacheKey = `${CACHE_TAGS.USER_SUMMARY_CACHE_KEY_PREFIX}:${user.id}`
    let userSummary: UserSummary | null = null

    try {
      await CacheHelper.get(cacheKey).then(async (result: UserSummary | null) => {
        if (result) {
          userSummary = result
        } else {
          // Compute and set a new key-value pair
          const user = await User.query()
            .select(
              'users.id',
              'users.email',
              'users.login_status',
              'users.is_account_activated',
              'users.is_email_verified',
              'users.role_id'
            )
            .where('id', this.id!)
            .preload('companies', (companiesQuery) => companiesQuery.select(...['id', 'name']))
            .preload('profile', (profileQuery) => {
              profileQuery.select(...['id', 'first_name', 'last_name', 'profile_picture']) // profile picture is added for the relationship below
              profileQuery.preload('profilePictureFile', (fileQuery) =>
                fileQuery.select('formats', 'url')
              )
            })
            .preload('role', (roleQuery) => roleQuery.select(...['name']))
            .preload('passwordHistories', (historiesQuery) =>
              historiesQuery
                .orderBy('created_at', 'desc')
                .select(...['created_at'])
                .first()
            )
            .first()

          const serialisedUser = user?.serialize()

          await CacheHelper.put(cacheKey, serialisedUser)

          // Add the `cacheKey` to sets
          const companiesTags = await this.getCompaniesCacheTags()
          const sets = [
            CACHE_TAGS.ALL_COMPANIES_CACHES_TAG,
            ...companiesTags,
            CACHE_TAGS.ALL_USERS_CACHES_TAG,
            CACHE_TAGS.ALL_USERS_SUMMARY_CACHES_TAG,
            `${CACHE_TAGS.USER_CACHE_TAG_PREFIX}:${user?.id}`,
            `${CACHE_TAGS.USER_SUMMARY_CACHE_TAG_PREFIX}:${user?.id}`,
          ]

          await CacheHelper.tag(sets, cacheKey)

          userSummary = serialisedUser as UserSummary
        }
      })
    } catch (error) {
      Logger.error('Error from App/Services/UserServices.getUserSummary: %o', error)
    }

    return userSummary!
  }

  public async getFullUserDetails(): Promise<UserFullDetails> {
    let userDetails: UserFullDetails | null = null

    const cacheKey = `${CACHE_TAGS.USER_DETAILS_CACHE_KEY_PREFIX}:${this.id}`
    await CacheHelper.get(cacheKey).then(async (result: UserFullDetails | null) => {
      if (result) {
        userDetails = result
      } else {
        // Compute and set a new key-value pair
        const user = await User.query()
          .preload('role', (roleQuery) => roleQuery.select('name', 'id'))
          .preload('profile', (profileQuery) => {
            profileQuery.preload('userCountry', (countryQuery) => countryQuery.select('id', 'name'))
            profileQuery.preload('userState', (stateQuery) => stateQuery.select('id', 'name'))
            profileQuery.preload('profilePictureFile', (fileQuery) =>
              fileQuery.select('formats', 'url')
            )
            profileQuery.select(
              'first_name',
              'last_name',
              'middle_name',
              'profile_picture', // important for the profilePictureFile relationship above
              'phone_number',
              'address',
              'city',
              'created_at',
              'updated_at',
              'country_id',
              'state_id'
            )
          })
          .where('id', this.id!)
          .first()

        const serialisedUserDetails = user?.serialize()

        await CacheHelper.put(cacheKey, serialisedUserDetails)

        // Add the `cacheKey` to sets
        const companiesTags = await this.getCompaniesCacheTags()
        const sets = [
          CACHE_TAGS.ALL_COMPANIES_CACHES_TAG,
          ...companiesTags,
          CACHE_TAGS.ALL_USERS_CACHES_TAG,
          CACHE_TAGS.ALL_USERS_DETAILS_CACHES_TAG,
          `${CACHE_TAGS.USER_CACHE_TAG_PREFIX}:${this.id}`,
          `${CACHE_TAGS.USER_DETAILS_CACHE_TAG_PREFIX}:${this.id}`,
        ]

        await CacheHelper.tag(sets, cacheKey)

        userDetails = serialisedUserDetails as UserFullDetails
      }
    })
    /* .catch((error) => {
        Logger.error('Error from App/Services/UserServices.getFullUserDetails: %j', error)
      }) */

    return userDetails!
  }

  /**
   * Get a SuperAdmins with the application
   * @param serialise Whether to return a serialised result or not
   * @param filters Columns to return
   * @returns {Promise<User[] | null>}
   */
  public async getSuperAdmins(serialise = false, filters: string[]): Promise<User[] | null> {
    const superAdmins = await User.query().withScopes((scopes) => scopes.SuperAdmins())
    if (!!superAdmins.length) {
      return serialise
        ? superAdmins.map(
            (superAdmin) =>
              superAdmin.serialize(
                !!filters.length ? { fields: { pick: [...filters] } } : void 0
              ) as User
          )
        : (superAdmins as User[])
    } else return null
  }

  public async getCompanyAdmins(serialise = false, filters: string[]): Promise<User[] | null> {
    const superAdmins = await User.query().withScopes((scopes) => scopes.SuperAdmins())
    if (!!superAdmins.length) {
      return serialise
        ? superAdmins.map(
            (superAdmin) =>
              superAdmin.serialize(
                !!filters.length ? { fields: { pick: [...filters] } } : void 0
              ) as User
          )
        : (superAdmins as User[])
    } else return null
  }
}
