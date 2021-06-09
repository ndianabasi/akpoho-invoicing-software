'use strict'
import Role from 'App/Models/Role'
import { globalRoles } from '../../../database/data/roles'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RolesController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  public async rolesForSelect({ response, isGlobalUser, authRole }: HttpContextContract) {
    const roles = await Role.query()
      .orderBy('name', 'asc')
      .select(...['id', 'name'])
      .where((query) => {
        if (!isGlobalUser) {
          query.whereNotIn('name', globalRoles)
        }
        if (!isGlobalUser && authRole?.name !== 'CompanyAdmin') {
          query.whereNotIn('name', [...globalRoles, 'CompanyAdmin'])
        }
      })

    const transformedRoles = roles.map((role) => {
      return {
        label: role.name,
        value: role.id,
      }
    })

    return response.ok({
      data: transformedRoles,
    })
  }

  public async globalRoles({ response }: HttpContextContract) {
    return response.ok({
      data: globalRoles,
    })
  }
}
