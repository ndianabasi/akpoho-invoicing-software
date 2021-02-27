import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  beforeSave,
  beforeCreate,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import CompanyHook from './Hooks/CompanyHook'
import User from 'App/Models/User'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string
  @column()
  public email: string
  @column()
  public phone_number: string
  @column()
  public is_approved: boolean
  @column()
  public address: string
  @column()
  public city: string
  @column()
  public state: number
  @column()
  public country: number
  @column()
  public slug: string
  @column()
  public size: number
  @column()
  public profile_picture: string
  @column()
  public website: string
  @column()
  public approved_at: DateTime
  @column()
  public approved_by: string

  @beforeCreate()
  public static generateUUID(company: Company) {
    CompanyHook.generateUUID(company)
  }

  @beforeSave()
  public static generateSlug(company: Company) {
    CompanyHook.generateSlug(company)
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => User)
  public users: ManyToMany<typeof User>
}
