'use strict'

import User from 'App/Models/User'
import Redis from '@ioc:Adonis/Addons/Redis'
import { UserFullDetails, UserOptions, UserSummary } from './types/user_types'
import Logger from '@ioc:Adonis/Core/Logger'
import CacheHelper from 'App/Helpers/CacheHelper'

export default class UserServices {
  protected email: string | undefined
  protected id: string | undefined
  protected user: User | null

  public constructor(userOptions: UserOptions) {
    const { email, id } = userOptions
    if (email && id)
      throw new Error('You should not supply both `email` and `id` at the same time.')
    this.email = email
    this.id = id
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
      companiesCacheTags = companies?.map((com) => `company_cache:${com.id}`)
      companiesUsersCacheTags = companies?.map((com) => `company_users_cache:${com.id}`)
    }

    return [...companiesCacheTags, ...companiesUsersCacheTags]
  }

  public async getUserSummary(): Promise<UserSummary> {
    try {
      const user = await this.getUserModel()

      const cacheKey = `user_summary:${user.id}`
      let userSummary: UserSummary | null = null
      await Redis.get(cacheKey)
        .then(async (result) => {
          if (result) {
            userSummary = JSON.parse(result)
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
              .preload('profile', (profileQuery) =>
                profileQuery.select(...['id', 'first_name', 'last_name', 'profile_picture'])
              )
              .preload('role', (roleQuery) => roleQuery.select(...['name']))
              .first()

            const serialisedUser = user?.serialize()

            await CacheHelper.put(cacheKey, serialisedUser)

            // Add the `cacheKey` to sets
            const companiesTags = await this.getCompaniesCacheTags()
            const sets = [
              'all_companies_caches',
              ...companiesTags,
              'all_users_caches',
              'all_users_summary_caches',
              `user_cache_tag:${user?.id}`,
              `user_summary_cache:${user?.id}`,
            ]

            await CacheHelper.tag(sets, cacheKey)

            userSummary = serialisedUser as UserSummary
          }
        })
        .catch((error) => {
          Logger.error('Error from App/Services/UserServices.getUserSummary: %j', error)
        })

      return userSummary!
    } catch (error: unknown) {
      throw new Error(JSON.stringify(error))
    }
  }

  public async getFullUserDetails(): Promise<UserFullDetails> {
    try {
      const cacheKey = `user_details:${this.id}`

      let userDetails: UserFullDetails | null = null
      await Redis.get(cacheKey)
        .then(async (result) => {
          if (result) {
            userDetails = JSON.parse(result)
          } else {
            // Compute and set a new key-value pair
            const user = await User.query()
              .preload('role', (roleQuery) => roleQuery.select('name', 'id'))
              .preload('profile', (profileQuery) => {
                profileQuery.preload('userCountry', (countryQuery) =>
                  countryQuery.select('id', 'name')
                )
                profileQuery.preload('userState', (stateQuery) => stateQuery.select('id', 'name'))
                profileQuery.select(
                  'first_name',
                  'last_name',
                  'middle_name',
                  'profile_picture',
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
              'all_companies_caches',
              ...companiesTags,
              'all_users_caches',
              'all_users_details_caches',
              `user_cache_tag:${this.id}`,
              `user_details_cache:${this.id}`,
            ]

            await CacheHelper.tag(sets, cacheKey)

            userDetails = serialisedUserDetails as UserFullDetails
          }
        })
        .catch((error) => {
          Logger.error('Error from App/Services/UserServices.getFullUserDetails: %j', error)
        })

      return userDetails!
    } catch (error: unknown) {
      throw new Error(JSON.stringify(error))
    }
  }
}
