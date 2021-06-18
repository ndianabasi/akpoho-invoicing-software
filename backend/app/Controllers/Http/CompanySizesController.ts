import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CompanySize from 'App/Models/CompanySize'

export default class CompanySizesController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  public async companySizesForSelect({ response }: HttpContextContract) {
    const roles = await CompanySize.query()
      .orderBy('id', 'asc')
      .select(...['id', 'size'])

    const transformedRoles = roles.map((role) => {
      return {
        label: role.size,
        value: role.id,
      }
    })

    return response.ok({
      data: transformedRoles,
    })
  }
}
