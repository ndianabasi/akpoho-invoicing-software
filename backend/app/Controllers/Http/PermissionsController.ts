import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permission from 'App/Models/Permission'

export default class PermissionsController {
  public async index({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  public async userPermissions({ authRole, response }: HttpContextContract) {
    await authRole?.load('permissions')
    const userPermissions = authRole?.permissions
    const userPermissionsNames = userPermissions?.map((permission) => permission.name)

    return response.ok({ data: userPermissionsNames })
  }
}
