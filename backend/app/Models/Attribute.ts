import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import FieldInputType from 'App/Models/FieldInputType'
import FieldInputValidationType from 'App/Models/FieldInputValidationType'
import AttributeGroup from './AttributeGroup'
import UUIDHook from './Hooks/UUIDHook'
import AttributeOption from './AttributeOption'
import AttributeSelection from './AttributeSelection'

export default class Attribute extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public attributeCode: string

  @column()
  public fieldInputTypeId: string

  @column()
  public fieldInputValidationTypeId: string

  @column()
  public defaultValue: string

  @column()
  public isSystemAttribute: boolean

  @column()
  public visibility: boolean

  @column()
  public showOnProductGrid: boolean

  @column()
  public useForProductFilter: boolean

  @column()
  public useForProductSearch: boolean

  @column()
  public useForProductSorting: boolean

  @column()
  public useForProductListing: boolean

  @column()
  public useForLayeredNavigation: boolean

  @column()
  public comparable: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => FieldInputType)
  public fieldInputType: BelongsTo<typeof FieldInputType>

  @belongsTo(() => FieldInputValidationType)
  public fieldInputValidationType: BelongsTo<typeof FieldInputValidationType>

  @manyToMany(() => AttributeGroup, {
    pivotTimestamps: true,
    pivotColumns: ['type'],
  })
  public groups: ManyToMany<typeof AttributeGroup>

  @manyToMany(() => AttributeOption, {
    pivotTimestamps: true,
    pivotColumns: ['sort_order'],
  })
  public options: ManyToMany<typeof AttributeOption>

  @manyToMany(() => AttributeSelection, {
    pivotTimestamps: true,
    pivotTable: 'attribute_selections',
  })
  public selectedOptions: ManyToMany<typeof AttributeSelection>

  @beforeCreate()
  public static generateUUID(model: Attribute) {
    UUIDHook.generateUUID(model, 'id')
  }
}
