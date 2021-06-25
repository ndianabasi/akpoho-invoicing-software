import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AttributeSet from 'App/Models/AttributeSet'

export default class AttributeSetsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  public async attributeSetsForSelect({ response }: HttpContextContract) {
    const attributeSets = await AttributeSet.query()
      .orderBy('sort_order', 'asc')
      .select(...['id', 'name'])

    const transformedSets = attributeSets.map((type) => {
      return {
        label: type.name,
        value: type.id,
      }
    })

    return response.ok({
      data: transformedSets,
    })
  }

  public async attributeSetData({
    response,
    requestedCompany,
    requestedAttributeSet,
    params,
    bouncer,
  }: HttpContextContract) {
    if (requestedAttributeSet) {
      await bouncer
        .with('AttributeSetPolicy')
        .authorize('view', requestedCompany ?? null, requestedAttributeSet)

      const { type } = params

      const attributeSetData = await AttributeSet.query()
        .where('id', requestedAttributeSet.id)
        .preload('attributeGroups', (attributeGroupsQuery) => {
          attributeGroupsQuery
            .orderBy('sort_order', 'asc')
            .preload('attributes', (attributesQuery) => {
              attributesQuery.pivotColumns(['sort_order'])
              attributesQuery.wherePivot('type', type)
              attributesQuery.preload('fieldInputType')
              attributesQuery.preload('fieldInputValidationType')
              attributesQuery.preload('options', (optionsQuery) => {
                optionsQuery.pivotColumns(['sort_order'])
              })
            })
        })
        .first()

      return response.ok({ data: attributeSetData })
    } else return response.abort({ message: 'Attribute Set not found' })
  }
}
