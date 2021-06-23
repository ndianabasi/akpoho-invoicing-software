import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import AttributeSet from './AttributeSet'
import Attribute from './Attribute'

export default class AttributeGroup extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public attributeSetId: string

  @column()
  public sortOrder: number

  @column()
  public isSystem: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => AttributeSet)
  public attributeSet: BelongsTo<typeof AttributeSet>

  @manyToMany(() => Attribute, {
    pivotTimestamps: true,
    pivotColumns: ['type'],
  })
  public attributes: ManyToMany<typeof Attribute>
}
