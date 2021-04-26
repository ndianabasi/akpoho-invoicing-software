import Env from '@ioc:Adonis/Core/Env'
import { v5 as uuidV5 } from 'uuid'

import PasswordGenerator from 'secure-random-password'

const UUID_NAMESPACE = Env.get('UUID_NAMESPACE')

interface UuidHookContract<T> {
  generateUUID: (modelInstance: T) => void
}

interface LucidModel {
  id: string
}

const UuidHook: UuidHookContract<LucidModel> = {
  generateUUID: (modelInstance): void => {
    try {
      const randomString = PasswordGenerator.randomString({
        length: 15,
      })

      modelInstance.id = uuidV5(randomString, UUID_NAMESPACE)
    } catch (error) {
      console.log(error)
    }
  },
}

export default UuidHook
