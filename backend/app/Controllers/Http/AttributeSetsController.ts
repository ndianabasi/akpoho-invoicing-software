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
}
