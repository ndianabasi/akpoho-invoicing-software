'use strict'

import User from 'App/Models/User'
import Cache from '@ioc:Adonis/Addons/Adonis5-Cache'

interface UserOptions {
  email?: User['email']
  id?: User['id']
}

interface UserCompany {
  id: string
  name: string
}

interface UserProfileSummary {
  id: string
  first_name: string
  last_name: string
  profile_picture: string
}
interface UserRoleSummary {
  name: string
}

interface UserSummary {
  id: string
  email: string
  login_status: boolean
  is_account_activated: boolean
  is_email_verified: boolean
  role_id: string
  companies: Array<UserCompany>
  profile: UserProfileSummary
  role: UserRoleSummary
}

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
      companiesCacheTags = companies?.map((com) => `company_cache_tag:${com.id}`)
      companiesUsersCacheTags = companies?.map((com) => `company_users_cache_tag:${com.id}`)
    }

    return [...companiesCacheTags, ...companiesUsersCacheTags]
  }

  public async getUserSummary(): Promise<UserSummary> {
    try {
      const user = await this.getUserModel()

      const cacheKey = `user:${user.id}`
      let cachedUser: UserSummary | string = await Cache.get(cacheKey, async () => {
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

        const companiesTags = await this.getCompaniesCacheTags()

        // Get the user's profile ID
        await Cache.tags(
          'all_companies_caches_tag',
          ...companiesTags,
          'all_users_caches_tag',
          'all_users_summary_caches_tag',
          `user_cache_tag:${user?.id}`,
          `user_summary_cache_tag:${user?.id}`
        ).put(cacheKey, JSON.stringify(serialisedUser))

        return JSON.parse(JSON.stringify(serialisedUser!))
      })

      if (typeof cachedUser === 'string') {
        cachedUser = JSON.parse(cachedUser)
        return cachedUser as UserSummary
      }
      return cachedUser as UserSummary
    } catch (error: unknown) {
      throw new Error(JSON.stringify(error))
    }
  }
}
