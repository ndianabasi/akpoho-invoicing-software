import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  beforeSave,
  beforeCreate,
  manyToMany,
  ManyToMany,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import CompanyHook from './Hooks/CompanyHook'
import User from 'App/Models/User'
import Customer from 'App/Models/Customer'

export default class Company extends BaseModel {
  public static selfAssignPrimaryKey = true

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
  public state: number | null
  @column()
  public country: number | null
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

  @hasMany(() => Customer)
  public customers: HasMany<typeof Customer>
}
