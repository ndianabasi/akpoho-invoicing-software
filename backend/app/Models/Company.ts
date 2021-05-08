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
  public phoneNumber: string
  @column()
  public isApproved: boolean
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
  public profilePicture: string
  @column()
  public website: string
  @column()
  public approvedAt: DateTime
  @column()
  public approvedBy: string

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

  @manyToMany(() => User, {
    pivotTimestamps: true,
  })
  public users: ManyToMany<typeof User>

  @hasMany(() => Customer)
  public customers: HasMany<typeof Customer>
}
