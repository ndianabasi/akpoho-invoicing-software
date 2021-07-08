'use strict'
import Logger from '@ioc:Adonis/Core/Logger'
import User from 'App/Models/User'

class PermissionHelper {
  public hasResourcePermission({
    resourcePermission,
    user,
    loggable,
  }: {
    resourcePermission: string
    user: User
    loggable: boolean
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        await user.load('role')
        const userRole = user.role

        if (userRole) {
          let rolePermissions = await userRole.related('permissions').query()
          const rolePermission = rolePermissions
            .filter((perm) => {
              return perm.name === resourcePermission
            })
            .map((perm) => perm.name)
            .reduce((accumulator, currentValue) => accumulator + currentValue, '')

          //console.log(rolePermission, resourcePermission)

          if (rolePermission && rolePermission.trim() === resourcePermission.trim()) {
            return resolve(true)
          } else {
            if (loggable) {
              Logger.warn(
                'PermissionHelper: User (%s) does not have resource permission (%s)',
                user.id,
                resourcePermission
              )
            }
            return resolve(false)
          }
        } else return resolve(false)
      } catch (error) {
        Logger.error('Helpers/PermissionHelper.js -> hasResourcePermission(): %j.', error)

        return reject(error)
      }
    })
  }
}

export default new PermissionHelper()
