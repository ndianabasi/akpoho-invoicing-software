import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProductType from 'App/Models/ProductType'

export default class ProductTypesController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  public async productTypesForSelect({ response }: HttpContextContract) {
    const productTypes = await ProductType.query()
      .where('is_active', true)
      .orderBy('sort_order', 'asc')
      .select(...['id', 'name'])

    const transformedTypes = productTypes.map((type) => {
      return {
        label: type.name,
        value: type.id,
      }
    })

    return response.ok({
      data: transformedTypes,
    })
  }
}
