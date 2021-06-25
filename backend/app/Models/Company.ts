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
  belongsTo,
  BelongsTo,
} from '@ioc:Adonis/Lucid/Orm'
import CompanyHook from 'App/Models/Hooks/CompanyHook'
import User from 'App/Models/User'
import Customer from 'App/Models/Customer'
import UploadedFile from 'App/Models/UploadedFile'
import CompanySize from 'App/Models/CompanySize'
import State from 'App/Models/State'
import Country from 'App/Models/Country'
import { TIMEZONE_DATE_TIME_FORMAT } from 'App/Helpers/utils'
import Attribute from 'App/Models/Attribute'
import AttributeSet from 'App/Models/AttributeSet'
import Product from 'App/Models/Product'
import ProductCategory from 'App/Models/ProductCategory'

export type CompanyType = 'personal' | 'corporate'

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
  public type: CompanyType

  @column()
  public stateId: number | null

  @column()
  public countryId: number | null

  @column()
  public slug: string

  @column()
  public companySizeId: number

  @column()
  public profilePicture: string

  @column()
  public website: string

  @column.dateTime({
    serialize(value: DateTime) {
      return value ? value.toFormat(TIMEZONE_DATE_TIME_FORMAT) : ''
    },
  })
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

  @column.dateTime({
    autoCreate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(TIMEZONE_DATE_TIME_FORMAT) : ''
    },
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(TIMEZONE_DATE_TIME_FORMAT) : ''
    },
  })
  public updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTimestamps: true,
  })
  public users: ManyToMany<typeof User>

  @hasMany(() => Customer)
  public customers: HasMany<typeof Customer>

  @hasMany(() => UploadedFile)
  public uploadFiles: HasMany<typeof UploadedFile>

  @belongsTo(() => CompanySize)
  public companySize: BelongsTo<typeof CompanySize>

  @belongsTo(() => State)
  public state: BelongsTo<typeof State>

  @belongsTo(() => Country)
  public country: BelongsTo<typeof Country>

  @manyToMany(() => Attribute, {
    pivotTimestamps: true,
  })
  public attributes: ManyToMany<typeof Attribute>

  @manyToMany(() => AttributeSet, {
    pivotTimestamps: true,
  })
  public attributeSets: ManyToMany<typeof AttributeSet>

  @manyToMany(() => Product, {
    pivotTimestamps: true,
  })
  public products: ManyToMany<typeof Product>

  @manyToMany(() => ProductCategory, {
    pivotTimestamps: true,
  })
  public productCategories: ManyToMany<typeof ProductCategory>
}
