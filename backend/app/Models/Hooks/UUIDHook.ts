import Env from '@ioc:Adonis/Core/Env'
import { v5 as uuidV5 } from 'uuid'

import PasswordGenerator from 'secure-random-password'

const UUID_NAMESPACE = Env.get('UUID_NAMESPACE')

interface LucidModel {
  id: string
}

interface UuidHookContract {
  generateUUID: (modelInstance: LucidModel, column?: string) => void
}

const UuidHook: UuidHookContract = {
  generateUUID: (modelInstance: LucidModel, column): void => {
    try {
      const randomString = PasswordGenerator.randomString({
        length: 15,
      })

      let selectedColumn: string = ''
      if (column) selectedColumn = column
      else selectedColumn = 'id'

      modelInstance[selectedColumn] = uuidV5(randomString, UUID_NAMESPACE)
    } catch (error) {
      console.log(error)
    }
  },
}

export default UuidHook
