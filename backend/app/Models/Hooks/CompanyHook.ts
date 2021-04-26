import Env from '@ioc:Adonis/Core/Env'
import { v5 as uuidv5 } from 'uuid'
import Company from 'App/Models/Company'
import slugify from 'slugify'

import PasswordGenerator from 'secure-random-password'

const UUID_NAMESPACE = Env.get('UUID_NAMESPACE')

interface CompanyHookContract {
  generateUUID: (companyInstance: Company) => void
  generateSlug: (companyInstance: Company) => void
}

const CompanyHook: CompanyHookContract = {
  generateUUID: (companyInstance) => {
    try {
      const tempSlug = slugify(companyInstance.name, {
        remove: /[*+~.()'"!:@]/g,
        lower: true,
        strict: true,
      })

      const randomString = PasswordGenerator.randomString({
        length: 15,
      })

      companyInstance.id = uuidv5(tempSlug + randomString, UUID_NAMESPACE)
    } catch (error) {
      console.log(error)
    }
  },
  generateSlug: (organisationInstance) => {
    if (
      organisationInstance.$dirty.slug &&
      organisationInstance.slug &&
      organisationInstance.slug.length > 0
    ) {
      return
    } else if (organisationInstance.$dirty.slug || organisationInstance.$dirty.name) {
      organisationInstance.slug = slugify(organisationInstance.name, {
        remove: /[*+~.()'"!:@]/g,
        lower: true,
        strict: true,
      })
    }
  },
}

export default CompanyHook
